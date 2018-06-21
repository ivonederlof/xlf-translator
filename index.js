const async = require('async');

const xlfProcesser = require('./lib/xlf-processor');
const xlfTranslator = require('./lib/xlf-translator');
const xml2js = require('xml2js');

const options = {
    fromLanguage: 'en',
    toLanguage: 'nl'
};

translateFile(options, () => {
    console.log('done');
});


/**
 * Translate a file from a specific path
 * @param options
 * @param callback
 */
function translateFile(options, callback) {

    async.waterfall([
        (callback) => {

            // get the file string
            xlfProcesser.readXlfFile('./files/translate.xlf', (err, xlfFileAsString) => {
                callback(err, xlfFileAsString);
            })
        },
        (xlfFileAsString, callback) => {

            // extract body and send to the translator class
            const file = xlfFileAsString.xliff.file[0];
            options.fromLanguage = file.$['source-language'];
            const body = file.body[0]['trans-unit'];

            xlfTranslator.translateBody(body, options.fromLanguage, options.toLanguage, (err, newBody) => {
                callback(err, xlfFileAsString, newBody);
            });
        },
        (xlfFileAsString, newBody, callback) => {

            // substitute the body with the new body and parse it back to the xml before saving
            xlfFileAsString.xliff.file[0].body[0]['trans-unit'] = newBody;
            const builder = new xml2js.Builder();
            const xml = builder.buildObject(xlfFileAsString);

            xlfProcesser.createXlfFile('./files/messages.xlf', xml, () => {
                callback();
            })
        }
    ], (err) => {
        callback(err);
    })
}
