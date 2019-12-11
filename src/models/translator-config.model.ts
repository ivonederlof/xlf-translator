import { Constants } from '../common/constants';

interface ITranslatorConfig {
  source: string;
  output: string;
  fromLanguage: string;
  toLanguages: string[];
}

export class TranslatorConfig {
  private readonly _source: string;
  private readonly _output: string;
  private readonly _fromLanguage: string;
  private readonly _toLanguages: string[];

  constructor(config: ITranslatorConfig) {
    this._source = config.source;
    this._output = config.output;
    this._fromLanguage = config.fromLanguage;
    this._toLanguages = config.toLanguages;
  }

  get source(): string {
    return this._source;
  }

  get output(): string {
    return this._output;
  }

  get fromLanguage(): string {
    return this._fromLanguage;
  }

  get toLanguages(): string[] {
    return this._toLanguages;
  }

  get languageFileNames() {
    return this.toLanguages.map(iso => [Constants.OUTPUT_FILE_NAME, iso, Constants.XLF].join('.'));
  }

}
