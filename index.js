const xlfFileProcessor = require('./lib/xlf-file-processor');
const xlfProcessor = require('./lib/xlf-processor');
const constants = require('./lib/constants');
const errors = require('./lib/errors');
const async = require('async');
const chalk = require('chalk');

function XlrTranslatorModule() {
    //constructor
}


/**
 * Check for missing files and translate this with the google api
 * @param messageOutputFileDir
 * @param callback
 */
XlrTranslatorModule.prototype.handleMissingTranslationMessageFiles = function (messageOutputFileDir, callback) {
    // check if there ara missing files
    async.waterfall([
        (callback) => {
            xlfFileProcessor.listFiles(messageOutputFileDir, (err, files) => {
                callback(err, files);
            });
        },
        (files, callback) => {
            const missingTranslations = [];
            const translationLocales = translatorConfig.toLanguage;
            const filesLocales = files.map((file) => file.split('.')[1]);
            translationLocales.forEach((translationLocale) => {
                if (filesLocales.indexOf(translationLocale) === -1) {
                    missingTranslations.push(translationLocale);
                }
            });

            if (!missingTranslations.length) {
                console.log(chalk.gray('No missing files, continue checking for updates\n'));
                return callback();
            }

            xlfProcessor.translateAndProcessFilesWithGoogleApi(missingTranslations, (err) => {
                console.log(chalk.gray(`Found missing files, added -> ${missingTranslations.join(', ')} files`));
                return callback(err, 'updated');
            });
        }
    ], (err) => {
        callback(err);
    })
};

/**
 * Main start translating method, this will check if stuff already exists
 */
XlrTranslatorModule.prototype.startTranslating = function (done) {

    const messageOutputFileDir = `${appRoot}${translatorConfig.outputPath}/messages`;
    async.waterfall([

        (callback) => {
            xlfFileProcessor.doesHaveFiles(messageOutputFileDir, (err, messagesExists) => {

                // if no files were found create new ones
                if (!messagesExists) {
                    console.log(chalk.gray('Did not find any existing translations, started translating with google ...\n'));
                    xlfProcessor.translateAndProcessFilesWithGoogleApi(translatorConfig.toLanguage, (err) => {
                        return done(err);
                    });
                }

                // check if there are new or missing files
                console.log(chalk.gray('Found existing translations\n'));
                this.handleMissingTranslationMessageFiles(messageOutputFileDir, (err) => {
                    callback(err);
                })
            });
        },
        (callback) => {
            xlfProcessor.handleExistingMessages((err) => {
                callback(err);
            });
        }
    ], (err) => {
        done(err);
    })
};

/**
 * Prepare before starting, check if there is a config file else add one, and that it has the need constants
 */
XlrTranslatorModule.prototype.validateFilesAndPrepareBeforeProcessing = function (callback) {

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
                    const file = `${appRoot}${translatorConfig.source}`;
                    xlfFileProcessor.doesFileExist(file, (err, doesExist) => {

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
