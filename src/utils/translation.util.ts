// @ts-ignore
import * as translate from '@k3rn31p4nic/google-translate-api';
import {Translated} from '../models/translated.model';
import {Global} from "../common/global";
import {Constants} from "../common/constants";

export class TranslationUtil {
    /**
     * Translate one text to iso
     * @param text {string}
     * @param iso {string} - default given from translator-config.json
     * @param timeout {number} - default given from translator-config.json
     */
    public static one(text: string, iso: string, timeout = Constants.TIMEOUT): Promise<Translated> {
        return new Promise<Translated>((resolve) => {
            setTimeout(() => {
                resolve();
            }, timeout)
        }).then(() => translate(text, {to: iso}).then(
            (translated: any) => new Translated(text, translated.text),
        ));
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
