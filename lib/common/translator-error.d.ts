export declare enum Errors {
    UNKNOWN = "Unknown error occurred",
    NO_TRANSLATOR_CONFIG_PRESENT = "Please add a translator.config.json file to the root of you project, none was found"
}
export declare class TranslatorError {
    /**
     * Throw a custom error
     * @param error {Errors}
     */
    static throwError(error?: string): Error;
}
