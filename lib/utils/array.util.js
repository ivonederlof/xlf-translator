function ArrayUtil() {
    // constructor
}

/**
 * Remove duplicates
 * @param array
 * @returns {any[]}
 */
ArrayUtil.prototype.removeDuplicates = function (array) {
    const set = new Set(array);
    return [...set];
};

module.exports = new ArrayUtil();
