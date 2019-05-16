#!/usr/bin/env node

const xlrTranslatorModule = require('./../index');
const constants = require('./../lib/constants.js');
const chalk = require('chalk');
const logSymbols = require('log-symbols');


global.appRoot = process.cwd();
global.translatorConfig = require(`${appRoot}/${constants.CONFIG_NAME}`);

console.log(`
            88    ad88                                                         88                                         
            88   d8"         ,d                                                88              ,d                         
            88   88          88                                                88              88                         
8b,     ,d8 88 MM88MMM     MM88MMM 8b,dPPYba, ,adPPYYba, 8b,dPPYba,  ,adPPYba, 88 ,adPPYYba, MM88MMM ,adPPYba,  8b,dPPYba,
 \`Y8, ,8P'  88   88 aaaaaaaa 88    88P'   "Y8 ""     \`Y8 88P'   \`"8a I8[    "" 88 ""     \`Y8   88   a8"     "8a 88P'   "Y8
   )888(    88   88 """""""" 88    88         ,adPPPPP88 88       88  \`"Y8ba,  88 ,adPPPPP88   88   8b       d8 88        
 ,d8" "8b,  88   88          88,   88         88,    ,88 88       88 aa    ]8I 88 88,    ,88   88,  "8a,   ,a8" 88        
8P'     \`Y8 88   88          "Y888 88         \`"8bbdP"Y8 88       88 \`"YbbdP"' 88 \`"8bbdP"Y8   "Y888 \`"YbbdP"'  88        
                                                                                                                                                                                                                   

`);


xlrTranslatorModule.validateFilesAndPrepareBeforeProcessing((err) => {
    if (err) {
        console.error(err)
    } else {
        xlrTranslatorModule.startTranslating((err, res) => {

            if(err) {
                throw err;
            }
            console.log(logSymbols.info, chalk.blue('Done ...'));
        });
    }
});
