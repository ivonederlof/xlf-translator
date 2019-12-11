"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Errors;
(function (Errors) {
    Errors["UNKNOWN"] = "Unknown error occurred";
    Errors["NO_TRANSLATOR_CONFIG_PRESENT"] = "Please add a translator.config.json file to the root of you project, none was found";
})(Errors = exports.Errors || (exports.Errors = {}));
class TranslatorError {
    /**
     * Throw a custom error
     * @param error {Errors}
     */
    static throwError(error = Errors.UNKNOWN) {
        return Error(error.toString());
    }
}
exports.TranslatorError = TranslatorError;
