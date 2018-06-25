#!/usr/bin/env node

const xlrTranslatorModule = require('./../index');

global.appRoot = process.cwd();

xlrTranslatorModule.prepare((err) => {
    if (err) {
        console.error(err)
    } else {
        xlrTranslatorModule.startTranslating();
    }
});
