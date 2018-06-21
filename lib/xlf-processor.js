const parseString = require('xml2js').parseString;
const fs = require('fs');
const async = require('async');


function XlfProcessor() {
    // constructor
}

/**
 * Read the xlf file and get the xml as string
 * @param dir
 * @param callback
 */
XlfProcessor.prototype.readXlfFile = function (dir, callback) {

    async.waterfall([
        (callback) => {
            fs.readFile(dir, (err, data) => {
                callback(err, data);
            });
        },
        (data, callback) => {
            parseString(data.toString(), function (err, xlfFileAsString) {
                callback(err, xlfFileAsString)
            });
        }
    ], (err, xlfFile) => {
        callback(err, xlfFile)
    })
};

/**
 * Create the actual xlf file
 * @param {String} dir
 * @param {Array} data
 * @param callback
 */
XlfProcessor.prototype.createXlfFile = function (dir, data, callback) {
    const stream = fs.createWriteStream(dir);
    stream.once('open', function (fd) {
        stream.write(data);
        stream.end();
        callback();
    });
};

module.exports = new XlfProcessor();
