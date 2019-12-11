import { XlfMessage } from './xlf-message.model';
export declare class Worksheet {
    private readonly _source;
    messages: XlfMessage[];
    constructor(messages: XlfMessage[], source: XlfMessage);
    get source(): XlfMessage;
}
