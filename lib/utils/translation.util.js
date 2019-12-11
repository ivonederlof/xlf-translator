"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const translate = require("google-translate-api");
const translated_model_1 = require("../models/translated.model");
class TranslationUtil {
    /**
     * Translate one text to iso
     * @param text {string}
     * @param iso {string} - default given from translator-config.json
     */
    static one(text, iso) {
        return translate(text, { to: iso }).then((translated) => new translated_model_1.Translated(text, translated.text));
    }
}
exports.TranslationUtil = TranslationUtil;
