// @ts-ignore
import * as translate from 'google-translate-api';
import { Translated } from '../models/translated.model';

export class TranslationUtil {
  /**
   * Translate one text to iso
   * @param text {string}
   * @param iso {string} - default given from translator-config.json
   */
  public static one(text: string | number | undefined, iso: string): Promise<Translated> {
    return translate(text, { to: iso }).then(
      (translated: any) => new Translated(text, translated.text),
    );
  }

  /**
   * Translate many texts
   * @param texts {string[]}
   * @param iso {string}
   */
  public static many(texts: string[], iso: string): Promise<Translated[]> {
    return Promise.all(
        texts.map((text) => this.one(text, iso))
    )
  }
}
