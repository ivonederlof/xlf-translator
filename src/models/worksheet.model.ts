import { Message } from './message.model';
import { FileUtil } from '../utils/file.util';
import {Global} from "../common/global";
import logger = Global.logger;

export class Worksheet {
  private readonly _source: Message;
  public messages: Message[];

  constructor(messages: Message[], source: Message) {
    this.messages = messages;
    this._source = source;
  }

  get source(): Message {
    return this._source;
  }

  /**
   * Update xlf file in output folder
   */
  public updateXlfFiles(): Promise<void> {
    return Promise.all(
      this.messages.map(message => FileUtil.writeFile([message.path], message.xlf)),
    ).then(() => {
      logger.info('\nUpdated xlf files')
    });
  }
}
