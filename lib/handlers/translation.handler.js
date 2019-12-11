"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TranslationHandler {
    /**
     * Translate all messages
     */
    translateAllMessages(worksheet) {
        return Promise.all(worksheet.messages.map(message => this._translateMessage(worksheet.source, message))).then(messages => {
            return new Promise(resolve => {
                worksheet.messages = messages;
                resolve(worksheet);
            });
        });
    }
    /**
     * Translate one message file a.k.a message.de.xlf
     * @param source
     * @param message
     */
    _translateMessage(source, message) {
        return new Promise((resolve, reject) => {
            message.body['trans-unit'].forEach((unit) => {
                unit = new TransUnit(unit.source, unit.target);
                console.log(unit);
            });
            console.log(JSON.stringify(message, null, 2));
            resolve(message);
        });
    }
}
exports.TranslationHandler = TranslationHandler;
class TransUnit {
    constructor(source, target) {
        this.source = source;
        this.target = !target && source || target;
    }
}
exports.TransUnit = TransUnit;
//
// {
//   "_attributes": {
//   "id": "app.title",
//       "datatype": "html"
// },
//   "source": {
//   "_text": "Xlf Translator"
// },
//   "context-group": {
//   "_attributes": {
//     "purpose": "location"
//   },
//   "context": [
//     {
//       "_attributes": {
//         "context-type": "sourcefile"
//       },
//       "_text": "app/app.component.html"
//     },
//     {
//       "_attributes": {
//         "context-type": "linenumber"
//       },
//       "_text": "2"
//     }
//   ]
// },
