"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_util_1 = require("../utils/file.util");
const xmlJs = require("xml-js");
const xml_js_1 = require("xml-js");
class XlfMessage {
    constructor(path, raw, iso) {
        this._iso = iso;
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
    get result() {
        return xml_js_1.js2xml(this.js);
    }
    get body() {
        try {
            return this._js.xliff.file.body;
        }
        catch (e) {
            throw Error(`Seems like the xlf file with path: \'${this.path}\' is malformed`);
        }
    }
    get transUnits() {
        try {
            return this._js.xliff.file.body['trans-unit'];
        }
        catch (e) {
            throw Error(`Seems like the xlf file with path: \'${this.path}\' is malformed`);
        }
    }
    set transUnits(transUnits) {
        try {
            this._js.xliff.file.body['trans-unit'] = transUnits;
        }
        catch (e) {
            throw Error(`Seems like the xlf file with path: \'${this.path}\' is malformed`);
        }
    }
}
exports.XlfMessage = XlfMessage;
