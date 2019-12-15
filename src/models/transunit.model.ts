import { ElementCompact } from 'xml-js';
import { TranslationUtil } from '../utils/translation.util';
import { Message } from './message.model';
import * as chalk from 'chalk';
import { Global } from '../common/global';
import { Translated } from './translated.model';
import { TargetType } from '../enum/target-type.enum';
import logger = Global.logger;

export class TransUnit implements ElementCompact {
  public target: ElementCompact;
  public source: ElementCompact;
  public translator: ElementCompact;
  private _message: Message;

  constructor(unit: ElementCompact, message: Message) {
    const self: TransUnit = this;
    Object.assign(self, unit);
    this._message = message;
    this.source = unit.source;
    this.target = (!unit.target && { ...unit.source }) || unit.target;
    this.translator = (unit && unit.translator) || { _text: '' };
  }

  /**
   * Get exported type trans unit, will be written in the xlf file, so remove unused props
   */
  get export(): TransUnit {
    delete this._message;
    return this;
  }

  get targetText(): string | number | undefined {
    return this.target && this.target._text;
  }

  get sourceText(): string | number | undefined {
    return this.source && this.source._text;
  }

  get translatorText(): string | number | undefined {
    return this.translator && this.translator._text;
  }

  /**
   * Get the target type for this trans unit
   */
  get targetType(): TargetType {
    const text = (this.sourceText && this.sourceText.toString()) || '';
    if (text.match(`.*\\VAR_PLURAL\\b.*`) && text.match(`.*\\VAR_SELECT\\b.*`)) {
      return TargetType.PLURALS;
    }

    if (text.match(`.*\\VAR_SELECT\\b.*`)) {
      return TargetType.SELECT;
    }
    return TargetType.DEFAULT;
  }

  /**
   * Translate for all types
   */
  public update(): Promise<TransUnit> {
    if (this.targetText && this.translatorText === this.targetText) {
      logger.custom(chalk.gray(`[${this._message.processed}]: ${this.targetText}`));
      return Promise.resolve(this);
    }

    if (this.targetText && this.translatorText && this.translatorText !== this.targetText) {
      logger.custom(
        chalk.green(`[${this._message.processed}]: ${this.translatorText} -> ${this.targetText}`),
      );
      this.translator._text = this.targetText;
      return Promise.resolve(this);
    }

    return this._handleTranslations();
  }

  private _handleTranslations() {
    switch (this.targetType) {
      case TargetType.SELECT:
        return this._handleSelectTranslation();
      case TargetType.PLURALS:
        return this._handlePluralTranslation();
      case TargetType.DEFAULT:
        return this._handleDefaultTranslation();
      default:
        throw Error('An unknown error occurred within checking the translation type');
    }
  }

  /**
   * Log target and source
   * @param target
   * @param source
   * @private
   */
  private _log(target: string | number | undefined, source: string | number | undefined) {
    logger.custom(
      chalk.blue(`[${this._message.processed}]: `) + `${target}` + ` ${chalk.gray(source)}`,
    );
  }

  /**
   * Handle a normal/default translation
   */
  private _handleDefaultTranslation(): Promise<TransUnit> {
    return new Promise((resolve, reject) => {
      TranslationUtil.one(this.sourceText, this._message.iso)
        .then((translated: Translated) => {
          this.target._text = translated.to;
          this.translator._text = translated.to;
          logger.custom(
              chalk.green(`[${this._message.processed}]: ++ ${this.targetText}`) + ` ${chalk.gray(this.sourceText)}`,
          );
          resolve(this);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Handle the select type translation
   * @private
   */
  private _handleSelectTranslation(): Promise<TransUnit> {
    const items = this._getTranslationItemsFromSelectPlural();
    if (!items || !items.length) {
      return Promise.resolve(this);
    }
    this.target._text = this.source._text;
    return TranslationUtil.many(items, this._message.iso).then((translatedItems: Translated[]) => {
      translatedItems.forEach(item => {
        this.target._text = this.targetText && this.targetText.toString().replace(`{${item.from}`, `{${item.to}`);
      });
      this.translator._text = this.targetText;
      logger.custom(
          chalk.green(`[${this._message.processed}]: ++ ${TargetType.SELECT} - (${translatedItems.map(t => t.to).join(', ')})`)
          + chalk.gray(` (${items.join(', ')})`)
      );
      return this;
    });
  }

  private _getTranslationItemsFromSelectPlural(): string[] {
    const context =
        typeof this.sourceText === 'string' &&
        this.sourceText.substring(1, this.sourceText.length - 1).toString();
    const strings = typeof context === 'string' && context.match(/[^{\\}]+(?=})/g);
   return strings && strings.length && strings.map(string => string.toString()) || [];
  }

  /**
   * Handle the plural type translation
   * @private
   */
  private _handlePluralTranslation(): Promise<TransUnit> {
    const items = this._getTranslationItemsFromSelectPlural();
    if (!items || !items.length) {
      return Promise.resolve(this);
    }
    this.target._text = this.source._text;
    return TranslationUtil.many(items, this._message.iso).then((translatedItems: Translated[]) => {
      translatedItems.forEach(item => {
        this.target._text = this.targetText && this.targetText.toString().replace(`{${item.from}`, `{${item.to}`);
      });
      this.translator._text = this.targetText;
      logger.custom(
          chalk.green(`[${this._message.processed}]: ++ ${TargetType.PLURALS} - (${translatedItems.map(t => t.to).join(', ')})`)
          + chalk.gray(` (${items.join(', ')})`)
      );
      return this;
    });
  }
}
