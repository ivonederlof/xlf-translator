"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const translation_handler_1 = require("./handlers/translation.handler");
const validation_handler_1 = require("./handlers/validation.handler");
const xlf_handler_1 = require("./handlers/xlf.handler");
const xlfHandler = new xlf_handler_1.XlfHandler();
const translatorHandler = new translation_handler_1.TranslationHandler();
const validationHandler = new validation_handler_1.ValidationHandler();
validationHandler
    .prepare()
    .then(xlfHandler.createXlfWorkSheet)
    .then((worksheet) => translatorHandler.translateAllMessages(worksheet))
    // .then((worksheet: Worksheet) => {
    //   console.log(worksheet.messages.map((message) => message.result))
    // })
    .then();
// execute()
//   .then(() => console.log('Done!'))
//   .catch(console.error);
//
// export function execute(): Promise<void> {
//   return validationHandler
//     .prepare()
//     .then(xlfHandler.createXlfWorkSheet)
//     .then((worksheet: Worksheet) => translatorHandler.translateAllMessages(worksheet))
//     // .then((worksheet: Worksheet) => {
//     //   console.log(worksheet.messages.map((message) => message.result))
//     // })
//     .then();
// }
