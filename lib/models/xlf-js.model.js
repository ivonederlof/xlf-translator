"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmlJs = require("xml-js");
class XlfJs {
    constructor(xlif) {
        Object.assign(this, xmlJs.xml2js(xlif, { compact: true }));
    }
}
exports.XlfJs = XlfJs;
