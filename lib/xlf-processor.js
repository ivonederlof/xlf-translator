const xlfTranslator = require('./xlf-translator');
const xlfFileProcessor = require('./xlf-file-processor');
const xml2js = require('xml2js');
const constants = require('./constants');
const errors = require('./errors');
const async = require('async');
const chalk = require('chalk');
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
            if (!translatorConfig.fromLanguage) {
                return callback(new Error(errors.NO_FROM_LANGUAGE));
            }
            if (translatorConfig.toLanguage.length === 0) {
                return callback(new Error(errors.NO_TO_LANGUAGE));
            }
            callback();
        },
        (callback) => {
            const xlfFilePath = `${appRoot}${translatorConfig.source}`;
            // get the file string
            xlfFileProcessor.readXlfFile(xlfFilePath, (err, xlfFileAsString) => {
                callback(err, xlfFileAsString);
            })
        },
        (xlfFileAsString, callback) => {

            // extract body and send to the translator class
            const file = xlfFileAsString.xliff.file[0];
            translatorConfig.fromLanguage = translatorConfig.fromLanguage ? translatorConfig.fromLanguage : file.$['source-language'];
            const bodyArray = file.body[0]['trans-unit'];

            async.forEach(translatorConfig.toLanguage, (languageToTranslate, next) => {

                async.waterfall([
                    (callback) => {
                        xlfTranslator.translateBody(bodyArray, translatorConfig.fromLanguage, languageToTranslate, (err, newBody) => {
                            callback(err, newBody);
                        });
                    },
                    (newBody, callback) => {

                        const path = [
                            `${appRoot}${translatorConfig.outputPath}`,
                            constants.FILE_OUTPUT_DIRECTORY].join('/');

                        xlfFileProcessor.createCsvOutputFilesFromBody(path, newBody, languageToTranslate, (err) => {
                            callback(err, newBody);
                        });
                    },
                    (newBody, callback) => {
                        // substitute the body with the new body and parse it back to the xml before saving
                        xlfFileAsString.xliff.file[0].body[0]['trans-unit'] = newBody;
                        const builder = new xml2js.Builder();
                        const xml = builder.buildObject(xlfFileAsString);
                        const path = `${appRoot}${translatorConfig.outputPath}/${constants.OUTPUT_FILE_NAME}/${constants.OUTPUT_FILE_NAME}.${languageToTranslate}.${constants.FILE_TYPE}`;
                        xlfFileProcessor.createXlfFile(path, xml, (err) => {
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
 * Get all the messages, check if all output files have the same length for translations,
 * then compare those with the source messages file.
 * @param callback
 */
XlfProcessor.prototype.checkAndUpdateMessagesIfAvailableFromSourceForTranslations = function (done) {

    let sourceMessages;
    let firstFileMessages;

    async.waterfall([

        (callback) => {
            const xlfFilePath = `${appRoot}${translatorConfig.source}`;
            xlfFileProcessor.readXlfFile(xlfFilePath, (err, xlfFileAsString) => {
                sourceMessages = xlfFileAsString.xliff.file[0].body[0]['trans-unit'];
                callback(err);
            })
        },
        (callback) => {

            // get the first file and use it as reference for comparation
            const dir = `${appRoot}${translatorConfig.outputPath}/${constants.OUTPUT_FILE_NAME}/${constants.OUTPUT_FILE_NAME}.${translatorConfig.toLanguage[0]}.${constants.FILE_TYPE}`;
            xlfFileProcessor.readXlfFile(dir, (err, xlfFile) => {
                firstFileMessages = xlfFile.xliff.file[0].body[0]['trans-unit'];
                callback(err);
            })
        },
        (callback) => {


            if (!sourceMessages || !firstFileMessages) {
                const noFilesError = new Error("Message files or the source file seems to be empty");
                return done(noFilesError);
            }

            // check length, if same return and check the csvs
            if (sourceMessages.length === firstFileMessages.length) {
                console.log('No updates found in source file');
                return done();
            }

            let newMessages = [];
            let removeMessages = [];

            const firstFileSourceIds = firstFileMessages.map((firstFileMessage) => firstFileMessage.$.id);
            const sourceFileIds = sourceMessages.map((sourceFileMessage) => sourceFileMessage.$.id);

            // check for removals
            firstFileMessages.forEach((firsFileMessage, index) => {
                const notExistingInSourceFile = sourceFileIds.indexOf(firsFileMessage.$.id);
                if (notExistingInSourceFile === -1) {
                    removeMessages.push(firstFileMessages[index]);
                }
            });

            // check for updates
            sourceMessages.forEach((sourceMessage, index) => {
                const notExistingInFirstFileIndex = firstFileSourceIds.indexOf(sourceMessage.$.id);
                if (notExistingInFirstFileIndex === -1) {
                    newMessages.push(sourceMessages[index]);
                }
            });

            const messageFilesDirPath = `${appRoot}${translatorConfig.outputPath}/${constants.OUTPUT_FILE_NAME}`;
            xlfFileProcessor.listFiles(messageFilesDirPath, (err, files) => {
                callback(err, files, newMessages, removeMessages);
            })
        },
        (files, newMessages, removeMessages, callback) => {

            async.each(files, (file, next) => {

                async.waterfall([
                    (callback) => {

                        const languageTo = file.split('.')[1];
                        xlfTranslator.translateBody(newMessages, translatorConfig.fromLanguage, languageTo, (err, translatedBodies) => {
                            callback(err, translatedBodies);
                        })
                    },
                    (translatedBodies, callback) => {

                        const filePath = `${appRoot}${translatorConfig.outputPath}/${constants.OUTPUT_FILE_NAME}/${file}`;
                        xlfFileProcessor.readXlfFile(filePath, (err, xlfFile) => {

                            // remove the body
                            const bodies = xlfFile.xliff.file[0].body[0]['trans-unit'];

                            removeMessages.forEach((message) => {
                                const bodyids = bodies.map((body) => body.$.id);
                                const indexOfRemoval = bodyids.indexOf(message.$.id);

                                xlfFile.xliff.file[0].body[0]['trans-unit'].splice(indexOfRemoval, 1);
                                console.log('Removed translation', message.$.id);
                            });


                            // set the translation
                            if (translatedBodies) {
                                xlfFile.xliff.file[0].body[0]['trans-unit'] = xlfFile.xliff.file[0].body[0]['trans-unit'].concat(translatedBodies);
                            }
                            callback(err, xlfFile);
                        })
                    },
                    (xlfFile, callback) => {
                        const builder = new xml2js.Builder();
                        const xml = builder.buildObject(xlfFile);
                        const path = `${appRoot}${translatorConfig.outputPath}/${constants.OUTPUT_FILE_NAME}/${file}`;

                        xlfFileProcessor.createXlfFile(path, xml, (err) => {
                            callback(err);
                        });
                    }
                ], (err) => {
                    next(err);
                })

            }, (err) => {
                callback(err);
            });
        }
    ], (err) => {
        done(err);
    })
};


/**
 * Handle if there are existing files
 * @param callback
 */
XlfProcessor.prototype.handleExistingMessages = function (callback) {
    async.waterfall([
        (callback) => {
            // check for updates in source file
            this.checkAndUpdateMessagesIfAvailableFromSourceForTranslations(() => {
                callback();
            });
        },
        (callback) => {

            this.translateFilesFromManualCsvTranslations((err) => {
                if (err) {
                    throw err;
                }
                callback(null, 'indexed');
            });
        }
    ], (err) => {
        callback(err);
    });
};

/**
 * Translate a file that has target, else it will break
 * @param callback
 */
XlfProcessor.prototype.translateFilesFromManualCsvTranslations = function (callback) {

    let totalMutated = 0;
    async.waterfall([

        (callback) => {
            xlfFileProcessor.listFiles(`${appRoot}${translatorConfig.outputPath}/translations/${constants.CSV}/`, (err, files) => {
                callback(err, files)
            })
        },
        (files, callback) => {

            // for every file
            async.forEach(files, (file, next) => {
                this.validateAndChangeTargetsIfNeeded(file, (err, mutatedCount) => {
                    totalMutated += mutatedCount;
                    next(err);
                });
            }, (err) => {
                callback(err);
            });
        }

    ], (err) => {

        if (totalMutated > 0) {
            console.log('\n', totalMutated, 'files updated\n');
        } else {
            console.log('No updates made in csv files\n');
        }
        callback(err);
    });
};

/**
 * Validate if there is change needed within csv and json
 * @param file
 * @param callback
 */
XlfProcessor.prototype.validateAndChangeTargetsIfNeeded = function (file, callback) {

    let totalMutated = 0;
    let messageFile = null;
    const filePath = `${appRoot}${translatorConfig.outputPath}/translations/${constants.CSV}/${file}`;

    async.waterfall([
        (callback) => {

            xlfFileProcessor.readAndParseCsvToJson(filePath, (err, translationArray) => {
                callback(err, translationArray);
            });
        },
        (translationsArray, callback) => {

            const fileName = StringUtil.removeExtension(file);
            const xlfFilePath = `${appRoot}${translatorConfig.outputPath}/messages/${fileName}.xlf`;

            xlfFileProcessor.readXlfFile(xlfFilePath, (err, xlfFile) => {

                if (!xlfFile) {
                    const err = `${errors.CONFIG_FILE_NOT_EXIST.description}, for path: ${xlfFilePath}`;
                    return callback(errors.CONFIG_FILE_NOT_EXIST.description);
                }

                messageFile = xlfFile;
                const messageTranslationArray = xlfFile.xliff.file[0].body[0]['trans-unit'];
                callback(err, fileName, translationsArray, messageTranslationArray);
            });
        },
        (fileName, translationsArray, messageTranslationArray, callback) => {

            if(!messageTranslationArray || !messageTranslationArray.length) {
                return callback(errors.MALLFORMED_FILES.description);
            }

            const messageTargets = messageTranslationArray.map((messageTranslation) => {
                return messageTranslation.target[0];
            });

            for (let index = 0; index < translationsArray.length; index++) {
                const target = translationsArray[index].target;
                if (!messageTargets.includes(target)) {
                    messageTranslationArray[index].target[0] = target;
                    totalMutated += 1;
                    console.log(chalk.yellow(`+++ ${target}`));
                }
            }
            callback(null, fileName, messageTranslationArray);
        },
        (fileName, translationsArray, callback) => {

            // substitute the body with the new body and parse it back to the xml before saving
            messageFile.xliff.file[0].body[0]['trans-unit'] = translationsArray;
            const builder = new xml2js.Builder();
            const xml = builder.buildObject(messageFile);

            xlfFileProcessor.createXlfFile(`${appRoot}${translatorConfig.outputPath}/${constants.OUTPUT_FILE_NAME}/${fileName}.${constants.FILE_TYPE}`, xml, (err) => {
                callback(err, translationsArray);
            });
        }
    ], (err) => {
        callback(err, totalMutated);
    })
};

module.exports = new XlfProcessor();
