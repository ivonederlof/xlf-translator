"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transunit_model_1 = require("../models/transunit.model");
class TranslationHandler {
    /**
     * Translate all messages
     */
    translateAllMessages(worksheet) {
        return Promise.all(worksheet.messages.map(message => this._translateMessage(worksheet.source, message))).then((messages) => {
            worksheet.messages = messages;
            return worksheet;
        });
    }
    /**
     * Translate one message file a.k.a message.de.xlf
     * @param source
     * @param message
     */
    _translateMessage(source, message) {
        return Promise.all(message.transUnits.map((unit) => {
            const translationUnit = new transunit_model_1.TransUnit(unit, unit.target);
            return translationUnit.translate('nl');
        })).then(transUnits => {
            message.transUnits = transUnits;
            return message;
        });
    }
}
exports.TranslationHandler = TranslationHandler;
