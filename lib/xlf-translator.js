const fs = require('fs');
const async = require('async');
const translate = require('google-translate-api');

function XlfTranslator() {
    // constructor
}

/**
 * Read the xlf file and get the xml as string
 * @param body
 * @param fromLanguage
 * @param toLanguage
 * @param callback
 */
XlfTranslator.prototype.translateBody = function (body, fromLanguage, toLanguage, callback) {
    const translatedBody = [];
    async.forEach(body, (item, next) => {
        const text = item.source[0];
        this.translateString(text, fromLanguage, toLanguage, (err, translatedString) => {

            const target = {target: [translatedString]};
            const newTranslatedItem = Object.assign(target, item);
            translatedBody.push(newTranslatedItem);
            next(err);
        });
    }, (err) => {
        if (!translatedBody.length) {
            return callback(new Error('could not create a translation for this file'))
        }
        callback(err, translatedBody);
    });
};

XlfTranslator.prototype.translateString = function (string, fromLanguage, toLanguage, callback) {

    translate(string, {from: fromLanguage, to: toLanguage}).then(res => {
        callback(null, res.text);
    }).catch(err => {
        callback(err);
    });
};


module.exports = new XlfTranslator();
