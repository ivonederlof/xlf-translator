function StringUtil() {
    // constructor
}

/**
 * Clean up a string
 * @param string
 * @returns {string | *}
 */
StringUtil.prototype.sanitize = function (string) {
    string = string.toString();
    string = string.replace(/\r?\n|\r/g, " ");
    string = string.replace('  ', ' ');
    string = string.trim();
    return string;
};

/**
 * Rememove the extension of a filename
 * @param filename
 * @returns {*}
 */
StringUtil.prototype.removeExtension = function (filename) {
    const lastDotPosition = filename.lastIndexOf(".");
    if (lastDotPosition === -1) return filename;
    else return filename.substr(0, lastDotPosition);
};

module.exports = new StringUtil();
