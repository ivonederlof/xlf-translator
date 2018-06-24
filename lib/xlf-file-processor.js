const parseString = require('xml2js').parseString;
const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');
const async = require('async');

function XlfFileProcessor() {
    // constructor
}

/**
 * Check if there are messages in the files dir
 * @param dir
 * @param callback
 */
XlfFileProcessor.prototype.doesHaveMessages = function (dir, callback) {
    fs.readdir(dir, (err, files) => {
        if (files.length) {
            return callback(null, true);
        }
        return callback(null, false);
    })
};

/**
 * Read the xlf file and get the xml as string
 * @param dir
 * @param callback
 */
XlfFileProcessor.prototype.readXlfFile = function (dir, callback) {

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
XlfFileProcessor.prototype.createXlfFile = function (dir, data, callback) {
    const stream = fs.createWriteStream(dir);
    stream.once('open', function (fd) {
        stream.write(data);
        stream.end();
        callback();
    });
};

/**
 * Create the csv for human manual translations
 * @param dir
 * @param bodies
 * @param callback
 */
XlfFileProcessor.prototype.createCsvFromBody = function (dir, bodies, callback) {

    const translations = bodies.map((body) => {
        return {id: body.$.id, source: body.source[0], target: body.target[0]};
    });

    const fields = ['id', 'source', 'target'];
    const json2csvParser = new Json2csvParser({fields});
    const csv = json2csvParser.parse(translations);
    fs.writeFile(dir, csv, function (err) {
        if (err) {
            return callback(err);
        }
        callback();
    });
};


module.exports = new XlfFileProcessor();
