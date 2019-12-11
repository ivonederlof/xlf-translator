/// <reference types="node" />
import { ElementCompact } from 'xml-js';
import { TransUnit } from './transunit.model';
export declare class XlfMessage implements Object {
    private readonly _iso;
    private readonly _path;
    private _xlf;
    private _js;
    constructor(path: string[], raw: Buffer, iso: string);
    get path(): string;
    get xlf(): string;
    get js(): ElementCompact;
    set xlf(value: string);
    get result(): string;
    get body(): any;
    get transUnits(): TransUnit[];
    set transUnits(transUnits: TransUnit[]);
}
