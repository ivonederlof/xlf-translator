const xlfTranslator = require('./xlf-translator');
const xlfFileProcessor = require('./xlf-file-processor');
const xml2js = require('xml2js');
const constants = require('./constants');
const errors = require('./errors');
const async = require('async');
const chalk = require('chalk');
const StringUtil = require('./utils/string.util');
const logSymbols = require('log-symbols');

function XlfProcessor() {
    // constructor;
}

/**
 * Translate a file automatically from a specific path, this means that it will generate a file that was translated by google
 * @param toLanguages
 * @param callback
 */
XlfProcessor.prototype.translateAndProcessFilesWithGoogleApi = function (toLanguages, callback) {

    async.waterfall([

        (callback) => {

            if (!translatorConfig.fromLanguage) {
                return callback(new Error(errors.NO_FROM_LANGUAGE));
            }

            if (translatorConfig.toLanguage.length === 0) {
                return callback(new Error(errors.NO_TO_LANGUAGE));
            }

            xlfFileProcessor.getXlfSourceFile((err, xlfSourceFile) => {
                callback(err, xlfSourceFile);
            })
        },
        (xlfSourceFile, callback) => {

            this.translateLanguagesAndCreateResources(toLanguages, xlfSourceFile, (err) => {
                callback(err);
            });
        },
    ], (err) => {
        callback(err);
    });
};

/**
 * Translate and create the resources
 * @param languages
 * @param xlfSourceFile
 * @param done
 */
XlfProcessor.prototype.translateLanguagesAndCreateResources = function (languages, xlfSourceFile, done) {

    // extract body and send to the translator class
    const file = xlfSourceFile.xliff.file[0];
    translatorConfig.fromLanguage = translatorConfig.fromLanguage ? translatorConfig.fromLanguage : file.$['source-language'];
    const bodyArray = file.body[0]['trans-unit'];

    async.eachLimit(languages, 1, (languageToTranslate, next) => {

        async.waterfall([
            (callback) => {
                xlfTranslator.translateBody(bodyArray, translatorConfig.fromLanguage, languageToTranslate, (err, newBody) => {
                    callback(err, newBody);
                });
            },
            (newBody, callback) => {

                const path = [`${appRoot}${translatorConfig.outputPath}`, constants.FILE_OUTPUT_DIRECTORY].join('/');
                xlfFileProcessor.createCsvOutputFilesFromBody(path, newBody, languageToTranslate, (err) => {
                    callback(err, newBody);
                });
            },
            (newBody, callback) => {
                // substitute the body with the new body and parse it back to the xml before saving
                xlfSourceFile.xliff.file[0].body[0]['trans-unit'] = newBody;

                const builder = new xml2js.Builder();
                const xml = builder.buildObject(xlfSourceFile);
                const path = `${appRoot}${translatorConfig.outputPath}/${constants.OUTPUT_FILE_NAME}/${constants.OUTPUT_FILE_NAME}.${languageToTranslate}.${constants.FILE_TYPE}`;

                xlfFileProcessor.createXlfFile(path, xml, (err) => {
                    callback(err);
                });
            }
        ], (err) => {
            next(err);
        });
    }, (err) => {
        done(err);
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
            xlfFileProcessor.getXlfSourceFile((err, xlfSourceFile) => {
                sourceMessages = xlfFileProcessor.getXlfMessages(xlfSourceFile);
                callback(err);
            });
        },
        (callback) => {
            const localeFirstFile = translatorConfig.toLanguage[0];
            xlfFileProcessor.getXlFileForLocale(localeFirstFile, (err, firstXlfFile) => {
                firstFileMessages = xlfFileProcessor.getXlfMessages(firstXlfFile);
                callback(err);
            });
        },
        (callback) => {

            let newMessages = [];
            let removeMessages = [];

            if (!sourceMessages || !firstFileMessages) {
                const noFilesError = new Error("Message files or the source file seems to be empty");
                return done(noFilesError);
            }

            // check length, if same return and check the csc
            if (sourceMessages.length === firstFileMessages.length) {
                console.log(logSymbols.success, chalk.gray('No missing files found in source file'));
                return done();
            }

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

            xlfFileProcessor.listAllTranslatedXlfFileNames((err, files) => {
                callback(err, files, newMessages, removeMessages);
            })
        },
        (files, newMessages, removeMessages, callback) => {

            async.each(files, (fileName, next) => {

                async.waterfall([
                    (callback) => {

                        const languageTo = fileName.split('.')[1];
                        xlfTranslator.translateBody(newMessages, translatorConfig.fromLanguage, languageTo, (err, translatedBodies) => {

                            if (err && err.statusCode === 429) {
                                return done(err);
                            }
                            callback(err, translatedBodies);
                        })
                    },
                    (translatedBodies, callback) => {

                        xlfFileProcessor.getXlfFileByName(fileName, (err, xlfFile) => {

                            if (translatedBodies && translatedBodies.length) {
                                xlfFile.xliff.file[0].body[0]['trans-unit'] = xlfFile.xliff.file[0].body[0]['trans-unit'].concat(translatedBodies);
                            }
                            callback(err, xlfFile, translatedBodies);
                        })
                    },
                    (xlfFile, translatedBodies, callback) => {
                        this.removeAndUpdateMessagesFromCsvAndTargetFile(translatedBodies, removeMessages, xlfFile, fileName, (err, xlfFile) => {
                            callback(err, xlfFile);
                        })
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
 * Remove the messages from source file and csv
 * @param removeMessages
 * @param newMessages
 * @param xlfFile
 * @param file
 * @param callback
 */
XlfProcessor.prototype.removeAndUpdateMessagesFromCsvAndTargetFile = function (newMessages, removeMessages, xlfFile, file, callback) {

    const locale = file.split('.')[1];
    const csvFileName = `messages.${locale}.${constants.CSV}`;
    const csvFilePath = `${appRoot}${translatorConfig.outputPath}/${constants.FILE_OUTPUT_DIRECTORY}/${constants.CSV}/${csvFileName}`;

    async.waterfall([
        (callback) => {

            // remove the csv items
            xlfFileProcessor.readAndParseCsvToJson(csvFilePath, (err, csvMessages) => {

                // first remove the messages
                const removeMessagesIds = removeMessages.map((removeMessage) => removeMessage.$.id);
                const tempMessages = [];


                csvMessages.forEach((csvMessage) => {
                    const index = removeMessagesIds.indexOf(csvMessage.id);
                    if (index === -1) {
                        tempMessages.push(csvMessage);
                    }
                });

                csvMessages = tempMessages;
                const newCsvMessages = newMessages ? newMessages.map((message) => {
                    return {
                        id: message.$.id,
                        source: message.source[0],
                        target: message.target[0]
                    }
                }) : [];

                csvMessages = csvMessages.concat(newCsvMessages);
                callback(err, csvMessages);
            });
        },

        (csvMessages, callback) => {
            xlfFileProcessor.saveJsonToCsv(csvFilePath, csvMessages, (err) => {
                callback(err);
            })
        },
        (callback) => {

            const bodies = xlfFile.xliff.file[0].body[0]['trans-unit'];
            removeMessages.forEach((message) => {
                const bodyIds = bodies.map((body) => body.$.id);
                const indexOfRemoval = bodyIds.indexOf(message.$.id);
                xlfFile.xliff.file[0].body[0]['trans-unit'].splice(indexOfRemoval, 1);
                console.log(chalk.red(`--- ${message.$.id} in ${csvFileName}`));
            });



            xlfFileProcessor.updateXlfFile(file, xlfFile, (err) => {
                callback(err, xlfFile);
            })
        }
    ], (err, xlfFile) => {
        callback(null, xlfFile);
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
            this.checkAndUpdateMessagesIfAvailableFromSourceForTranslations((err) => {
                callback(err);
            });
        },
        (callback) => {
            this.translateFilesFromManualCsvTranslations((err) => {
                callback(err);
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
            console.log(logSymbols.success, chalk.gray(`${totalMutated} files updated`));
        } else {
            console.log(logSymbols.success, chalk.gray('No updates made in csv files'));
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

            xlfFileProcessor.readAndParseCsvToJson(filePath, (err, csvTranslationArray) => {
                callback(err, csvTranslationArray);
            });
        },
        (csvTranslationArray, callback) => {

            const fileName = StringUtil.removeExtension(file);
            const xlfFilePath = `${appRoot}${translatorConfig.outputPath}/messages/${fileName}.xlf`;

            xlfFileProcessor.readXlfFile(xlfFilePath, (err, xlfFile) => {

                if (!xlfFile) {
                    const error = new Error(`${errors.COULD_NOT_READ.description}, for path: ${xlfFilePath}`);
                    return callback(error);
                }

                messageFile = xlfFile;
                const messageTranslationArray = xlfFile.xliff.file[0].body[0]['trans-unit'];
                callback(err, fileName, csvTranslationArray, messageTranslationArray);
            });
        },
        (fileName, csvTranslationArray, messageTranslationArray, callback) => {

            if (!messageTranslationArray || !messageTranslationArray.length) {
                return callback(errors.MALLFORMED_FILES.description);
            }

            const messageTargets = messageTranslationArray.map((messageTranslation) => {
                return messageTranslation.target[0];
            });

            csvTranslationArray.forEach((translation, index) => {

                const target = csvTranslationArray[index].target;
                if (!messageTargets.includes(target)) {
                    if (messageTranslationArray[index]) {
                        messageTranslationArray[index].target[0] = target;
                        totalMutated += 1;
                        console.log(chalk.yellow(`+++ ${target} for id ${messageTranslationArray[index].$.id}`));
                    } else {
                        console.warn(logSymbols.warning, chalk.yellow('A target was not provided'));
                    }
                }
            });

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
