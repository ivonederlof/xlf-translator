#!/usr/bin/env node

const xlrTranslatorModule = require('./../index');

global.appRoot = process.cwd();
global.config = require(`${appRoot}/translate.config.json`);

xlrTranslatorModule.prepare((err) => {
    if (err) {
        console.error(err)
    } else {
        xlrTranslatorModule.startTranslating();
    }
});
