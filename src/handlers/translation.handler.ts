import { Worksheet } from '../models/worksheet.model';
import { ElementCompact } from 'xml-js';
import { TransUnit } from '../models/transunit.model';
import { Message } from '../models/message.model';
import { Global } from '../common/global';
import logger = Global.logger;

export class TranslationHandler {
  /**
   * Translate all messages
   */
  public translateAllMessages(worksheet: Worksheet): Promise<Worksheet> {
    return Promise.all(
      worksheet.messages.map(message => this._translateMessage(worksheet.source, message)),
    ).then((messages: Message[]) => {
      worksheet.messages = messages;
      return worksheet;
    });
  }

  /**
   * Translate one message file a.k.a message.de.xlf
   * @param source
   * @param message
   */
  private _translateMessage(source: Message, message: Message): Promise<Message> {
    logger.info(`\nTranslating ${message.iso}:\n`);
    return Promise.all(
      message.transUnits.map((unit: ElementCompact) => {
        const translationUnit = new TransUnit(unit, unit.target);
        logger.info(
          `translated: ${translationUnit.target._text} -> ${translationUnit.target._text}`,
        );
        return translationUnit.translate(message.iso);
      }),
    ).then(transUnits => {
      message.transUnits = transUnits;
      return message;
    });
  }
}
