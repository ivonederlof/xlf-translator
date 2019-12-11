import { Translated } from '../models/translated.model';
export declare class TranslationUtil {
    /**
     * Translate one text to iso
     * @param text {string}
     * @param iso {string} - default given from translator-config.json
     */
    static one(text: string | number | undefined, iso: string): Promise<Translated>;
}
