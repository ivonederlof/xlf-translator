const xlfFileProcessor = require('./lib/xlf-file-processor');
const xlfProcessor = require('./lib/xlf-processor');
const constants = require('./lib/constants');
const errors = require('./lib/errors');
const async = require('async');

function XlrTranslatorModule() {
    //constructor
}

/**
 * Main start translating method, this will check if stuff already exists
 */
XlrTranslatorModule.prototype.startTranslating = function (callback) {
    xlfFileProcessor.doesHaveFiles(`${appRoot}${translatorConfig.outputPath}/messages`, (err, messagesExists) => {
        if (messagesExists) {
            console.info('Found existing translations, started indexing manual translations');
            xlfProcessor.translateFileFromManualCsvDirectory((err) => {
                if (err) {
                    throw err;
                }
                callback(null, 'indexed');

            });
        } else {
            console.info('Did not find any existing translations, started translating with google ...');
            xlfProcessor.translateFileWithGoogleApi((err) => {
                if (err) {
                    throw err;
                }
                callback(null, 'created');
            });
        }
    });
};

/**
 * Prepare before starting, check if there is a config file else add one, and that it has the need constants
 */
XlrTranslatorModule.prototype.prepare = function (callback) {

    async.waterfall([
        (callback) => {
            const dirPath = `${appRoot}/${constants.CONFIG_NAME}`;
            xlfFileProcessor.doesFileExist(dirPath, (err, doesExist) => {

                if (!doesExist) {
                    return callback(errors.CONFIG_FILE_NOT_EXIST.description)
                }

                callback(err);
            })
        },
        (callback) => {
            const dirPath = `${appRoot}/${constants.PACKAGE_JSON}`;
            xlfFileProcessor.doesFileExist(dirPath, (err, doesExist) => {

                if (!doesExist) {
                    return callback(errors.NOT_IN_A_PROJECT.description)
                }

                callback(err);
            });
        },
        (callback) => {

            async.waterfall([

                (callback) => {
                    xlfFileProcessor.doesFileExist(`${appRoot}${translatorConfig.source}/messages.xlf`, (err, doesExist) => {

                        if (!doesExist) {
                            return callback(errors.CONFIG_MESSAGE_FILE_NOT_EXIST);
                        }

                        callback(err);
                    })
                },
                (callback) => {
                    // check if locale directory is present
                    xlfFileProcessor.dirExistOrCreate(`${appRoot}${translatorConfig.outputPath}`, (err) => {
                        callback(err);
                    });
                },
                (callback) => {
                    // check if message directory is present
                    xlfFileProcessor.dirExistOrCreate(`${appRoot}${translatorConfig.outputPath}/messages`, (err) => {
                        callback(err);
                    });
                },
                (callback) => {
                    // check if translations directory is present
                    xlfFileProcessor.dirExistOrCreate(`${appRoot}${translatorConfig.outputPath}/translations`, (err) => {
                        callback(err);
                    });
                },
                (callback) => {
                    // check if translations directory is present
                    xlfFileProcessor.dirExistOrCreate(`${appRoot}${translatorConfig.outputPath}/translations/csv`, (err) => {
                        callback(err);
                    });
                }
            ], (err) => {
                callback(err);
            })
        }
    ], (err) => {
        callback(err);
    });
};


module.exports = new XlrTranslatorModule();
