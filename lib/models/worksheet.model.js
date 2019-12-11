"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Worksheet {
    constructor(messages, source) {
        this.messages = messages;
        this._source = source;
    }
    get source() {
        return this._source;
    }
}
exports.Worksheet = Worksheet;
