#!/usr/bin/env node

const xlrTranslatorModule = require('./../index');

const rootDir = process.cwd();
xlrTranslatorModule.prepare(rootDir, (err) => {
    if (err) {
        console.error(err)
    } else {
        xlrTranslatorModule.startTranslating();
    }
});
