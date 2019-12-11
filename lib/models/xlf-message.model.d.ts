/// <reference types="node" />
import { ElementCompact } from "xml-js";
export declare class XlfMessage implements Object {
    private readonly _path;
    private _xlf;
    private _js;
    constructor(path: string[], raw: Buffer);
    get path(): string;
    get xlf(): string;
    get js(): ElementCompact;
    set xlf(value: string);
    get body(): any;
    set transUnit(transUnit: any);
}
