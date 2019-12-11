"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const translation_util_1 = require("../utils/translation.util");
class TransUnit {
    constructor(unit, target) {
        const self = this;
        Object.assign(self, unit);
        this.target = (!target && unit.source) || target;
    }
    translate(iso) {
        return translation_util_1.TranslationUtil.one(this.text, iso).then((translated) => {
            this.target._text = translated.to;
            return this;
        });
    }
    get text() {
        return this.target._text;
    }
}
exports.TransUnit = TransUnit;
