import {ElementCompact} from "xml-js";
import {TranslationUtil} from "../utils/translation.util";

export class TransUnit implements ElementCompact {
    public target: ElementCompact;
    public source: ElementCompact;

    constructor(unit: ElementCompact, target: ElementCompact) {
        const self: TransUnit = this;
        Object.assign(self, unit);
        this.source = unit.source;
        this.target = (!target && unit.source) || target;
    }

    public translate(iso: string): Promise<TransUnit> {
        return TranslationUtil.one(this.text, iso).then((translated) => {
            this.target._text = translated.to;
            return this;
        });
    }

    get text(): string | number | undefined {
        return this.target._text;
    }
}
