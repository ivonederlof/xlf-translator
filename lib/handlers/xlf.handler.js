"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worksheet_model_1 = require("../models/worksheet.model");
const constants_1 = require("../common/constants");
const file_util_1 = require("../utils/file.util");
const global_1 = require("../common/global");
const xlf_message_model_1 = require("../models/xlf-message.model");
class XlfHandler {
    /**
     * Check if has all message files, otherwise create a copy of source
     * @private
     */
    createXlfWorkSheet() {
        return Promise.all(global_1.Global.config.toLanguages.map(iso => {
            const fileName = global_1.Global.config.localeFileName(iso);
            const path = [global_1.Global.config.output, constants_1.Constants.XLF_OUTPUT_DIRECTORY, fileName];
            return file_util_1.FileUtil.copyFile([global_1.Global.config.source], path).then(fileBuffer => new xlf_message_model_1.XlfMessage(path, fileBuffer, iso));
        })).then(messages => file_util_1.FileUtil.readFile([global_1.Global.config.source]).then(source => {
            const sourceMessage = new xlf_message_model_1.XlfMessage([global_1.Global.config.source], source, global_1.Global.config.fromLanguage);
            return new worksheet_model_1.Worksheet(messages, sourceMessage);
        }));
    }
}
exports.XlfHandler = XlfHandler;
