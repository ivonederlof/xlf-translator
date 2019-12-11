export class Translated {
  private readonly _from: string;
  private readonly _to: string;

  constructor(from: string, to: string) {
    this._from = from;
    this._to = to;
  }

  get from(): string {
    return this._from;
  }

  get to(): string {
    return this._to;
  }
}
