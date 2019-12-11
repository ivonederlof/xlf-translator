"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const translation_handler_1 = require("./handlers/translation.handler");
const validation_handler_1 = require("./handlers/validation.handler");
const xlf_handler_1 = require("./handlers/xlf.handler");
const xlfHandler = new xlf_handler_1.XlfHandler();
const translatorHandler = new translation_handler_1.TranslationHandler();
const validationHandler = new validation_handler_1.ValidationHandler();
execute()
    .then(() => console.log('Done!'))
    .catch(console.error);
function execute() {
    return validationHandler
        .prepare()
        .then(xlfHandler.createXlfWorkSheet)
        .then((worksheet) => translatorHandler.translateAllMessages(worksheet))
        .then();
}
exports.execute = execute;
// translatorHandler
//     .many(['Hallo', 'Ik ben ivo', 'Ik heb zin in een koekje'], 'de')
//     .then((translated: Translated[]) => {
//         translated.map(tr => console.log('Translated -> ', tr.from, ' - ', tr.to));
//     })
//     .catch((error: Error) => {
//         console.error(error);
//     });
