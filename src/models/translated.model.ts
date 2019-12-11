export class Translated {
  private readonly _from: string | number | undefined;
  private readonly _to: string;

  constructor(from: string | number | undefined, to: string) {
    this._from = from;
    this._to = to;
  }

  get from(): string | number | undefined {
    return this._from;
  }

  get to(): string {
    return this._to;
  }
}
