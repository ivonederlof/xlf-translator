import { Constants } from '../common/constants';
import { Errors, TranslatorError } from '../common/translator-error';

interface ITranslatorConfig {
  source: string;
  output: string;
  fromLanguage: string;
  toLanguages: string[];
  debug?: boolean | undefined;
}

export class TranslatorConfig {
  private readonly _source: string;
  private readonly _output: string;
  private readonly _fromLanguage: string;
  private readonly _toLanguages: string[];
  private readonly _debug: boolean | undefined = false;

  constructor(config: ITranslatorConfig) {
    try {
      this._source = config.source;
      this._output = config.output;
      this._fromLanguage = config.fromLanguage;
      this._toLanguages = config.toLanguages;
      this._debug = config.debug;
    } catch (e) {
      throw TranslatorError.throwError(Errors.NO_TRANSLATOR_CONFIG_PRESENT);
    }
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

  get debug() {
    return this._debug;
  }

  get isValid(): boolean {
    return Object.keys(this).length === 5;
  }

  public localeFileName(iso: string) {
    return [Constants.OUTPUT_FILE_NAME, iso, Constants.XLF].join('.');
  }

  public toString() {
    return JSON.stringify(this, null, 2);
  }
}
