import { Worksheet } from '../models/worksheet.model';
import { ElementCompact } from 'xml-js';
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
export declare class TransUnit implements ElementCompact {
    source: ElementCompact;
    target: ElementCompact;
    constructor(source: ElementCompact, target: ElementCompact);
}
