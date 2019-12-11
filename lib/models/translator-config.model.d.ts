interface ITranslatorConfig {
    source: string;
    output: string;
    fromLanguage: string;
    toLanguages: string[];
}
export declare class TranslatorConfig {
    private readonly _source;
    private readonly _output;
    private readonly _fromLanguage;
    private readonly _toLanguages;
    constructor(config: ITranslatorConfig);
    get source(): string;
    get output(): string;
    get fromLanguage(): string;
    get toLanguages(): string[];
    get languageFileNames(): string[];
}
export {};
