import { ElementCompact } from "xml-js";
export declare class TransUnit implements ElementCompact {
    target: ElementCompact;
    constructor(unit: ElementCompact, target: ElementCompact);
    translate(iso: string): Promise<TransUnit>;
    get text(): string | number | undefined;
}
