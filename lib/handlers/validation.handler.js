"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_handler_1 = require("./file.handler");
const file_util_1 = require("../utils/file.util");
const global_1 = require("../common/global");
const constants_1 = require("../common/constants");
class ValidationHandler {
    constructor() {
        this._fileHandler = new file_handler_1.FileHandler();
    }
    /**
     * Prepare the process
     */
    prepare() {
        return this._fileHandler
            .hasSourceFile()
            .then(() => file_util_1.FileUtil.createManyDirectories([
            file_util_1.FileUtil.createPath([global_1.Global.config.output, constants_1.Constants.XLF_OUTPUT_DIRECTORY]),
        ]))
            .then(() => console.log('Validated folder/file structure'));
    }
}
exports.ValidationHandler = ValidationHandler;
