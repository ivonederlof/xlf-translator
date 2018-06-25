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
XlrTranslatorModule.prototype.startTranslating = function () {
    xlfFileProcessor.doesHaveFiles(`${appRoot}/src/locale/messages`, (err, messagesExists) => {
        if (messagesExists) {
            console.warn('found message src, started indexing manual translations');
            xlfProcessor.translateFileFromManualCsvDirectory((err) => {
                if (err) {
                    console.error(err);
                }
                console.log('re-indexed your translations');

            });
        } else {
            console.warn('did not find any messages, started translating with google ...');
            xlfProcessor.translateFileWithGoogleApi((err) => {
                if (err) {
                    console.error(err);
                }
                console.log('created new translations')
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
                    // check if locale directory is present
                    xlfFileProcessor.dirExistOrCreate(`${appRoot}/src/locale`, (err) => {
                        callback(err);
                    });
                },
                (callback) => {
                    // check if message directory is present
                    xlfFileProcessor.dirExistOrCreate(`${appRoot}/src/locale/messages`, (err) => {
                        callback(err);
                    });
                },
                (callback) => {
                    // check if translations directory is present
                    xlfFileProcessor.dirExistOrCreate(`${appRoot}/src/locale/translations`, (err) => {
                        callback(err);
                    });
                },
                (callback) => {
                    // check if translations directory is present
                    xlfFileProcessor.dirExistOrCreate(`${appRoot}/src/locale/translations/csv`, (err) => {
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
