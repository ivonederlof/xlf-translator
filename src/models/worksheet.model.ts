import { XlfMessage } from './xlf-message.model';

export class Worksheet {
  private readonly _source: XlfMessage;
  public messages: XlfMessage[];

  constructor(messages: XlfMessage[], source: XlfMessage) {
    this.messages = messages;
    this._source = source;
  }

  get source(): XlfMessage {
    return this._source;
  }
}
