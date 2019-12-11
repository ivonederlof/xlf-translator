"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Translated {
    constructor(from, to) {
        this._from = from;
        this._to = to;
    }
    get from() {
        return this._from;
    }
    get to() {
        return this._to;
    }
}
exports.Translated = Translated;
