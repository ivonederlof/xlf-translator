const xlfTranslator = require('./xlf-translator');
const xlfFileProcessor = require('./xlf-file-processor');
const xml2js = require('xml2js');
const constants = require('./constants');
const errors = require('./errors');
const async = require('async');
const StringUtil = require('./utils/string.util');

function XlfProcessor() {
    // constructor;
}

/**
 * Translate a file automatically from a specific path, this means that it will generate a file that was translated by google
 * @param callback
 */
XlfProcessor.prototype.translateFileWithGoogleApi = function (callback) {

    async.waterfall([
        // first validate before processing
        (callback) => {
            if (!config.fromLanguage) {
                return callback(new Error(errors.NO_FROM_LANGUAGE));
            }
            if (config.toLanguage.length === 0) {
                return callback(new Error(errors.NO_TO_LANGUAGE));
            }
            callback();
        },
        (callback) => {
            const xlfFilePath = `${appRoot}/${constants.OUTPUT_DIRECTORY}/${constants.SOURCE_FILE_NAME}.${constants.FILE_TYPE}`;
            // get the file string
            xlfFileProcessor.readXlfFile(xlfFilePath, (err, xlfFileAsString) => {
                callback(err, xlfFileAsString);
            })
        },
        (xlfFileAsString, callback) => {

            // extract body and send to the translator class
            const file = xlfFileAsString.xliff.file[0];
            config.fromLanguage = config.fromLanguage ? config.fromLanguage : file.$['source-language'];
            const bodyArray = file.body[0]['trans-unit'];

            async.forEach(config.toLanguage, (languageToTranslate, next) => {

                async.waterfall([
                    (callback) => {
                        xlfTranslator.translateBody(bodyArray, config.fromLanguage, languageToTranslate, (err, newBody) => {
                            callback(err, newBody);
                        });
                    },
                    (newBody, callback) => {

                        const csvPath = [appRoot,
                            constants.OUTPUT_DIRECTORY,
                            constants.CSV_OUTPUT_DIRECTORY,
                            constants.CSV,
                            `messages.${languageToTranslate}.${constants.CSV}`].join('/');

                        xlfFileProcessor.createCsvFromBody(csvPath, newBody, (err) => {
                            callback(err, newBody);
                        });
                    },
                    (newBody, callback) => {
                        // substitute the body with the new body and parse it back to the xml before saving
                        xlfFileAsString.xliff.file[0].body[0]['trans-unit'] = newBody;
                        const builder = new xml2js.Builder();
                        const xml = builder.buildObject(xlfFileAsString);

                        xlfFileProcessor.createXlfFile(`${appRoot}/${constants.OUTPUT_DIRECTORY}/${constants.OUTPUT_FILE_NAME}/${constants.OUTPUT_FILE_NAME}.${languageToTranslate}.${constants.FILE_TYPE}`, xml, (err) => {
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
};

/**
 * Translate a file that has target, else it will break
 * @param callback
 */
XlfProcessor.prototype.translateFileFromManualCsvDirectory = function (callback) {

    async.waterfall([
        (callback) => {
            xlfFileProcessor.listFiles(`${appRoot}/src/locale/translations/csv/`, (err, files) => {
                callback(err, files)
            })
        },
        (files, callback) => {
            // for every file
            async.forEach(files, (file, next) => {
                this.validateAndChangeTargetsIfNeeded(file, (err) => {
                    next(err);
                });
            }, (err) => {
                callback(err);
            });
        }
    ], (err) => {
        callback(err);
    });
};


XlfProcessor.prototype.validateAndChangeTargetsIfNeeded = function (file, callback) {

    let messageFile = null;
    async.waterfall([
        (callback) => {
            const csvPath = `${appRoot}/src/locale/translations/csv/${file}`;
            xlfFileProcessor.readAndParseCsvToJson(csvPath, (err, csvTranslationsArray) => {
                callback(err, csvTranslationsArray);
            });
        },
        (csvTranslationsArray, callback) => {

            const fileName = StringUtil.removeExtension(file);
            const xlfFilePath = `${appRoot}/src/locale/messages/${fileName}.xlf`;

            xlfFileProcessor.readXlfFile(xlfFilePath, (err, xlfFile) => {
                messageFile = xlfFile;
                const messageTranslationArray = xlfFile.xliff.file[0].body[0]['trans-unit'];
                callback(err, fileName, csvTranslationsArray, messageTranslationArray);
            });
        },
        (fileName, csvTranslationsArray, messageTranslationArray, callback) => {

            let totalMutated = 0;
            const messageTargets = messageTranslationArray.map((messageTranslation) => {
                return messageTranslation.target[0];
            });

            for (let index = 0; index < csvTranslationsArray.length; index++) {
                const target = csvTranslationsArray[index].target;
                if (!messageTargets.includes(target)) {
                    messageTranslationArray[index].target[0] = target;
                    totalMutated += 1;
                    console.warn('+++', target);
                }
            }
            console.warn(`${totalMutated} translations updated for ${fileName}`);
            callback(null, fileName, messageTranslationArray);
        },
        (fileName, messageTranslationArray, callback) => {
            // substitute the body with the new body and parse it back to the xml before saving
            messageFile.xliff.file[0].body[0]['trans-unit'] = messageTranslationArray;
            const builder = new xml2js.Builder();
            const xml = builder.buildObject(messageFile);

            xlfFileProcessor.createXlfFile(`${appRoot}/${constants.OUTPUT_DIRECTORY}/${constants.OUTPUT_FILE_NAME}/${fileName}.${constants.FILE_TYPE}`, xml, (err) => {
                callback(err);
            });
        }

    ], (err) => {
        callback(err);
    })
};

module.exports = new XlfProcessor();
