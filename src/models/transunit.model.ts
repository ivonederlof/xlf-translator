import { ElementCompact } from 'xml-js';
import { TranslationUtil } from '../utils/translation.util';
import { Message } from './message.model';
import * as chalk from 'chalk';
import { Global } from '../common/global';
import logger = Global.logger;
import { Translated } from './translated.model';
import {TargetType} from "../enum/target-type.enum";

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
    this.translator = unit.translator || { _text: '' };
  }

  /**
   * Get exported type trans unit, will be written in the xlf file, so remove unused props
   */
  get export(): TransUnit {
    delete this._message;
    return this;
  }

  get text(): string | number | undefined {
    return this.source && this.source._text;
  }

  get type(): TargetType {
    const text = (this.text && this.text.toString()) || '';

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
    switch (this.type) {
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
   * Handle a normal/default translation
   */
  private _handleDefaultTranslation(): Promise<TransUnit> {
    return new Promise((resolve, reject) => {
      TranslationUtil.one(this.text, this._message.iso)
        .then((translated: Translated) => {
          this.target._text = translated.to;
          this.translator._text = translated.to;
          logger.custom(
            chalk.blue(`[${this._message.processed}]: `) +
              `${this.target._text}` +
              ` ${chalk.gray(this.source._text)}`,
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
    return new Promise(resolve => {
      this.target._text = this.source._text;
      logger.custom(
        chalk.blue(`[${this._message.processed}]: `) +
          `${TargetType.SELECT}` +
          ` ${chalk.gray(TargetType.SELECT)}`,
      );
      resolve(this);
    });
  }

  /**
   * Handle the plural type translation
   * @private
   */
  private _handlePluralTranslation(): Promise<TransUnit> {
    return new Promise(resolve => {
      this.target._text = this.source._text;
      logger.custom(
        chalk.blue(`[${this._message.processed}]: `) +
          `${TargetType.PLURALS}` +
          ` ${chalk.gray(TargetType.PLURALS)}`,
      );
      resolve(this);
    });
  }
}
