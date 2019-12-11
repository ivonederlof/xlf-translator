import { FileUtil } from '../utils/file.util';

import * as xmlJs from 'xml-js';
import {ElementCompact} from "xml-js";

export class XlfMessage implements Object {
  private readonly _path: string;
  private _xlf: string;
  private _js: ElementCompact;

  constructor(path: string[], raw: Buffer) {
    this._path = FileUtil.createPath(path);
    this._xlf = raw.toString();
    this._js = xmlJs.xml2js(this._xlf, { compact: true });
  }

  get path(): string {
    return this._path;
  }

  get xlf(): string {
    return this._xlf;
  }

  get js(): ElementCompact {
    return this._js;
  }

  set xlf(value: string) {
    this._xlf = value;
  }

  get body() {
    try {
      return this.js.xliff.file.body;
    } catch (e) {
      throw Error(`Seems like the xlf file with path: \'${this.path}\' is malformed`);
    }
  }

  set transUnit(transUnit: any) {
    this.js.xliff.file.body['trans-unit'] = transUnit;
  }
}
