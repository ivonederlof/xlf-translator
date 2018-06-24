const async = require('async');
const xlfFileProcessor = require('./lib/xlf-file-processor');
const xlfTranslator = require('./lib/xlf-translator');
const xml2js = require('xml2js');
const config = require('./translate.config');
const constants = require('./lib/constants');
const errors = require('./lib/errors');

start();

function start() {

    console.warn('Initiated xlf-translator ...');

    xlfFileProcessor.doesHaveMessages('./files/messages', (err, exists) => {
        if (exists) {
            console.warn('found message files, started indexing manual translations\n');
            translateFileFromManualCsvDirectory((err) => {
                if (err) {
                    console.error(err);
                }
                console.log('reindexed your translations')
            })
        } else {
            console.warn('did not found any messages, started translating with google ...\n');
            translateFileWithGoogleApi((err) => {
                if (err) {
                    console.error(err);
                }
                console.log('created new translations')
            });
        }
    });
}

/**
 * Translate a file that has target, else it will break
 * @param callback
 */
function translateFileFromManualCsvDirectory(callback) {

    callback();
}

/**
 * Translate a file automaticy from a specific path, this means that it will generate a file that was translated by google
 * @param callback
 */
function translateFileWithGoogleApi(callback) {

    async.waterfall([
        // first validate before processing
        (callback) => {
            if (!config.project) {
                return callback(new Error(errors.NO_PROJECT_NAME.description));
            }
            if (!config.fromLanguage) {
                return callback(new Error(errors.NO_FROM_LANGUAGE));
            }
            if (config.toLanguage.length === 0) {
                return callback(new Error(errors.NO_TO_LANGUAGE));
            }
            callback();
        },
        (callback) => {

            // get the file string
            xlfFileProcessor.readXlfFile(`./${constants.OUTPUT_DIRECTORY}/${constants.SOURCE_FILE_NAME}.${constants.FILE_TYPE}`, (err, xlfFileAsString) => {
                callback(err, xlfFileAsString);
            })
        },
        (xlfFileAsString, callback) => {

            // extract body and send to the translator class
            const file = xlfFileAsString.xliff.file[0];
            config.fromLanguage = config.fromLanguage ? config.fromLanguage : file.$['source-language'];
            const body = file.body[0]['trans-unit'];

            async.forEach(config.toLanguage, (languageToTranslate, next) => {

                async.waterfall([
                    (callback) => {
                        xlfTranslator.translateBody(body, config.fromLanguage, languageToTranslate, (err, newBody) => {
                            callback(err, newBody);
                        });
                    },
                    (newBody, callback) => {

                        xlfFileProcessor.createCsvFromBody(`./${constants.OUTPUT_DIRECTORY}/${constants.CSV_OUTPUT_DIRECTORY}/${constants.CSV}/translation.${languageToTranslate}.${constants.CSV}`, newBody, (err) => {
                            callback(err, newBody);
                        });
                    },
                    (newBody, callback) => {
                        // substitute the body with the new body and parse it back to the xml before saving
                        xlfFileAsString.xliff.file[0].body[0]['trans-unit'] = newBody;
                        const builder = new xml2js.Builder();
                        const xml = builder.buildObject(xlfFileAsString);

                        xlfFileProcessor.createXlfFile(`./${constants.OUTPUT_DIRECTORY}/${constants.OUTPUT_FILE_NAME}/${constants.OUTPUT_FILE_NAME}.${languageToTranslate}.${constants.FILE_TYPE}`, xml, (err) => {
                            callback(err);
                        });
                    }
                ], (err) => {
                    // wait otherwise google will block this ip address
                    setTimeout(() => {
                        console.warn(`translated ${languageToTranslate}`);
                        next(err);
                    }, 3000)
                });
            }, (err) => {
                callback(err);
            });
        },
    ], (err) => {
        callback(err);
    });
}



