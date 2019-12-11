import { Worksheet } from '../models/worksheet.model';
export declare class TranslationHandler {
    /**
     * Translate all messages
     */
    translateAllMessages(worksheet: Worksheet): Promise<Worksheet>;
    /**
     * Translate one message file a.k.a message.de.xlf
     * @param source
     * @param message
     */
    private _translateMessage;
}
