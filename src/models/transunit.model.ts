import { ElementCompact } from 'xml-js';
import { TranslationUtil } from '../utils/translation.util';
import { TranslationType } from '../enum/translation-type.model';

export class TransUnit implements ElementCompact {
  public target: ElementCompact;
  public source: ElementCompact;
  private _type: TranslationType;

  constructor(unit: ElementCompact, target: ElementCompact) {
    const self: TransUnit = this;
    Object.assign(self, unit);
    this.source = unit.source;4
    this.target = (!target && { ...unit.source }) || target;
    this._type = this.type;
  }

  public translate(iso: string): Promise<TransUnit> {
    return new Promise<TransUnit>((resolve, reject) => {
      if (this.type === (TranslationType.SELECT || TranslationType.PLURALS)) {
        resolve();
      }

      TranslationUtil.one(this.text, iso)
        .then(translated => {
          this.target._text = translated.to;
          resolve(this);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  get text(): string | number | undefined {
    return this.target && this.target._text;
  }

  get type(): TranslationType {
    const text = (this.text && this.text.toString()) || '';
    if (text.match(`.*\\VAR_SELECT\\b.*`)) {
      return TranslationType.SELECT;
    }

    if (text.match(`.*\\VAR_PLURAL\\b.*`)) {
      return TranslationType.PLURALS;
    }

    return TranslationType.DEFAULT;
  }
}
