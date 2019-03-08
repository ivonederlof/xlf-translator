#!/usr/bin/env node

const xlrTranslatorModule = require('./../index');
const constants = require('./../lib/constants.js');

global.appRoot = process.cwd();
global.translatorConfig = require(`${appRoot}/${constants.CONFIG_NAME}`);

xlrTranslatorModule.prepare((err) => {
    if (err) {
        console.error(err)
    } else {
        xlrTranslatorModule.startTranslating((err, res) => {
            if (res === 'indexed') {
                console.log('Re-indexed all your translation messages');
                return;
            }

            console.info('Created new translations ...')

        });
    }
});
