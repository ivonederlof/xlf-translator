import { Worksheet } from '../models/worksheet.model';
import { Message } from '../models/message.model';
import { Global } from '../common/global';
import { Languages } from '../common/languages';
import { TransUnit } from '../models/transunit.model';
import * as Promise from 'bluebird';
import logger = Global.logger;

export class MessageHandler {
  /**
   * Translate all messages
   */
  public handleMessagesForWorksheet(worksheet: Worksheet): Promise<Worksheet> {
    return Promise.each(worksheet.messages, message => {
      logger.info(`\nTranslating ${Languages.get(message.iso)}:\n`);
      return this._handleMessage(worksheet.source, message);
    }).then((messages: Message[]) => {
      worksheet.messages = messages;
      return worksheet;
    });
  }

  /**
   * Translate one message file a.k.a message.de.xlf
   * @param source
   * @param message
   */
  private _handleMessage(source: Message, message: Message): Promise<Message> {
    return Promise.mapSeries(message.transUnits, (unit) => {
      message.incrementProcessedItem();
      const translationUnit = new TransUnit(unit, message);
      return translationUnit.update();
    }).then((transUnits) => {
      message.transUnits = transUnits.map((transUnit) => transUnit.export);
      return message;
    });
  }
}
