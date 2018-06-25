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

    xlfFileProcessor.doesHaveFiles('./src/locale/messages', (err, messagesExists) => {
        if (messagesExists) {
            console.warn('found message src, started indexing manual translations');
            xlfProcessor.translateFileFromManualCsvDirectory((err) => {
                if (err) {
                    console.error(err);
                }
                console.log('re-indexed your translations')
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
XlrTranslatorModule.prototype.prepare = function (projectDir, callback) {

    async.waterfall([
        (callback) => {
            const dir = `${projectDir}/${constants.CONFIG_NAME}`;
            xlfFileProcessor.doesFileExit(dir, (err, doesExist) => {

                if (!doesExist) {
                    return callback(errors.CONFIG_FILE_NOT_EXIST.description)
                }

                callback(err);
            })
        }
    ], (err) => {
        callback(err);
    });
};

module.exports = new XlrTranslatorModule();
