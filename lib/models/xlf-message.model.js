"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_util_1 = require("../utils/file.util");
const xmlJs = require("xml-js");
class XlfMessage {
    constructor(path, raw) {
        this._path = file_util_1.FileUtil.createPath(path);
        this._xlf = raw.toString();
        this._js = xmlJs.xml2js(this._xlf, { compact: true });
    }
    get path() {
        return this._path;
    }
    get xlf() {
        return this._xlf;
    }
    get js() {
        return this._js;
    }
    set xlf(value) {
        this._xlf = value;
    }
    get body() {
        try {
            return this.js.xliff.file.body;
        }
        catch (e) {
            throw Error(`Seems like the xlf file with path: \'${this.path}\' is malformed`);
        }
    }
    set transUnit(transUnit) {
        this.js.xliff.file.body['trans-unit'] = transUnit;
    }
}
exports.XlfMessage = XlfMessage;
