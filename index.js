const async = require('async');

const xlfProcesser = require('./lib/xlf-file-processor');
const xlfTranslator = require('./lib/xlf-translator');
const xml2js = require('xml2js');
const config = require('./config');
const constants = require('./lib/constants');
const errors = require('./lib/errors');

    console.log(err);
    console.log('Done ;)');
});

/**
 * Translate a file that has target, else it will break
 * @param callback
 */
function translateFromFile(callback) {

    callback();
}

/**
 * Translate a file automaticy from a specific path, this means that it will generate a file that was translated by google
 * @param callback
 */
function translateAutomaticFile(callback) {

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
            xlfProcesser.readXlfFile(`./${constants.OUTPUT_DIRECTORY}/${constants.SOURCE_FILE_NAME}.${constants.FILE_TYPE}`, (err, xlfFileAsString) => {
                callback(err, xlfFileAsString);
            })
        },
        (xlfFileAsString, callback) => {

            // extract body and send to the translator class
            const file = xlfFileAsString.xliff.file[0];
            config.fromLanguage = config.fromLanguage ? config.fromLanguage : file.$['source-language'];
            const body = file.body[0]['trans-unit'];
            const bodies = [];

            async.forEach(config.toLanguage, (languageToTranslate, next) => {
                xlfTranslator.translateBody(body, config.fromLanguage, languageToTranslate, (err, newBody) => {
                    bodies.push(newBody);
                    next(err);
                });

            }, (err) => {
                callback(err, xlfFileAsString, bodies);
            });
        },
        (xlfFileAsString, bodies, callback) => {

            async.forEach(bodies, (body, next) => {
                // substitute the body with the new body and parse it back to the xml before saving
                xlfFileAsString.xliff.file[0].body[0]['trans-unit'] = body;
                const builder = new xml2js.Builder();
                const xml = builder.buildObject(xlfFileAsString);

                xlfProcesser.createXlfFile(`./${constants.OUTPUT_DIRECTORY}/${constants.OUTPUT_FILE_NAME}.${constants.FILE_TYPE}`, xml, () => {
                    next();
                })

            }, (err) => {
                callback(err);
            });
        }
    ], (err) => {
        callback(err);
    });
}
