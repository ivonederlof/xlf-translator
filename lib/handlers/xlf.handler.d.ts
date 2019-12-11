import { Worksheet } from '../models/worksheet.model';
export declare class XlfHandler {
    /**
     * Check if has all message files, otherwise create a copy of source
     * @private
     */
    createXlfWorkSheet(): Promise<Worksheet>;
}
