import { Worksheet } from '../models/worksheet.model';
import { XlfMessage } from '../models/xlf-message.model';
import { Attributes, Element, ElementCompact } from 'xml-js';

export class TranslationHandler {
  /**
   * Translate all messages
   */
  public translateAllMessages(worksheet: Worksheet): Promise<Worksheet> {
    return Promise.all(
      worksheet.messages.map(message => this._translateMessage(worksheet.source, message)),
    ).then(messages => {
      return new Promise<Worksheet>(resolve => {
        worksheet.messages = messages;
        resolve(worksheet);
      });
    });
  }

  /**
   * Translate one message file a.k.a message.de.xlf
   * @param source
   * @param message
   */
  private _translateMessage(source: XlfMessage, message: XlfMessage): Promise<XlfMessage> {
    return new Promise<XlfMessage>((resolve, reject) => {
      message.body['trans-unit'].forEach((unit: ElementCompact) => {
        unit = new TransUnit(unit.source, unit.target);
        console.log(unit);
      });
      console.log(JSON.stringify(message, null, 2));
      resolve(message);
    });
  }
}

export class TransUnit implements ElementCompact {
  public target: ElementCompact;

  constructor(public source: ElementCompact, target: ElementCompact) {
    this.target = !target && source || target;
  }
}

//
// {
//   "_attributes": {
//   "id": "app.title",
//       "datatype": "html"
// },
//   "source": {
//   "_text": "Xlf Translator"
// },
//   "context-group": {
//   "_attributes": {
//     "purpose": "location"
//   },
//   "context": [
//     {
//       "_attributes": {
//         "context-type": "sourcefile"
//       },
//       "_text": "app/app.component.html"
//     },
//     {
//       "_attributes": {
//         "context-type": "linenumber"
//       },
//       "_text": "2"
//     }
//   ]
// },
