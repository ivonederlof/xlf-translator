"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const translator_config_model_1 = require("../models/translator-config.model");
var Global;
(function (Global) {
    Global.root = process.cwd();
    Global.config = new translator_config_model_1.TranslatorConfig(require([Global.root, constants_1.Constants.CONFIG_NAME].join('/')));
})(Global = exports.Global || (exports.Global = {}));
