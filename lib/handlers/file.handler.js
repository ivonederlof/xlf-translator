"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_util_1 = require("../utils/file.util");
const global_1 = require("../common/global");
const translator_error_1 = require("../common/translator-error");
class FileHandler {
    /**
     * Check if there is a source file the project a.k.a messages.xlf
     * @private
     */
    hasSourceFile() {
        return file_util_1.FileUtil.hasFile([global_1.Global.config.source])
            .then(isPresent => isPresent)
            .catch(() => {
            throw translator_error_1.TranslatorError.throwError(translator_error_1.Errors.NO_TRANSLATOR_CONFIG_PRESENT);
        });
    }
}
exports.FileHandler = FileHandler;
