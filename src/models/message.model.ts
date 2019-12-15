import { FileUtil } from '../utils/file.util';

import * as xmlJs from 'xml-js';
import { ElementCompact, js2xml } from 'xml-js';
import { TransUnit } from './transunit.model';

export class Message implements Object {
  private readonly _iso: string;
  private readonly _path: string;
  private _xlf: string;
  public js: ElementCompact;

  private _processed: number = 0;

  constructor(path: string[], raw: Buffer, iso: string) {
    this._iso = iso;
    this._path = FileUtil.createPath(path);
    this._xlf = raw.toString();
    this.js = xmlJs.xml2js(this._xlf, { compact: true });
  }

  get path(): string {
    return this._path;
  }

  get processed() {
    return this._processed;
  }

  get iso() {
    return this._iso;
  }

  get xlf(): string {
    return this._xlf;
  }

  set xlf(value: string) {
    this._xlf = value;
  }

  get transUnits() {
    try {
      return this.js.xliff.file.body['trans-unit'];
    } catch (e) {
      throw Error(`Seems like the xlf file with path: \'${this.path}\' is malformed`);
    }
  }

  set transUnits(transUnits: TransUnit[]) {
    try {
      this.js.xliff.file.body['trans-unit'] = transUnits;
      this._xlf = js2xml(this.js, { compact: true, spaces: 2 });
    } catch (e) {
      throw Error(`Could not write to xlf for message on path: \'${this.path}\'`);
    }
  }

  public incrementProcessedItem() {
    this._processed++;
  }
}
