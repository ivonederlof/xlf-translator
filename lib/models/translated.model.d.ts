export declare class Translated {
    private readonly _from;
    private readonly _to;
    constructor(from: string | number | undefined, to: string);
    get from(): string | number | undefined;
    get to(): string;
}
