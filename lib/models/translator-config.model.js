"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../common/constants");
class TranslatorConfig {
    constructor(config) {
        this._source = config.source;
        this._output = config.output;
        this._fromLanguage = config.fromLanguage;
        this._toLanguages = config.toLanguages;
    }
    get source() {
        return this._source;
    }
    get output() {
        return this._output;
    }
    get fromLanguage() {
        return this._fromLanguage;
    }
    get toLanguages() {
        return this._toLanguages;
    }
    get languageFileNames() {
        return this.toLanguages.map(iso => [constants_1.Constants.OUTPUT_FILE_NAME, iso, constants_1.Constants.XLF].join('.'));
    }
}
exports.TranslatorConfig = TranslatorConfig;
