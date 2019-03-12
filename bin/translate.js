#!/usr/bin/env node

const xlrTranslatorModule = require('./../index');
const constants = require('./../lib/constants.js');
const chalk = require('chalk');

global.appRoot = process.cwd();
global.translatorConfig = require(`${appRoot}/${constants.CONFIG_NAME}`);

console.log(`
                                 888                                      888          888                    
                                 888                                      888          888                    
                                 888                                      888          888                    
88888b.   .d88b.  888  888       888888 888d888 8888b.  88888b.  .d8888b  888  8888b.  888888 .d88b.  888d888 
888 "88b d88P"88b \`Y8bd8P'       888    888P"      "88b 888 "88b 88K      888     "88b 888   d88""88b 888P"   
888  888 888  888   X88K  888888 888    888    .d888888 888  888 "Y8888b. 888 .d888888 888   888  888 888     
888  888 Y88b 888 .d8""8b.       Y88b.  888    888  888 888  888      X88 888 888  888 Y88b. Y88..88P 888     
888  888  "Y88888 888  888        "Y888 888    "Y888888 888  888  88888P' 888 "Y888888  "Y888 "Y88P"  888     
              888                                                                                             
         Y8b d88P                                                                                             
          "Y88P"                                                                                              

`);


xlrTranslatorModule.prepare((err) => {
    if (err) {
        console.error(err)
    } else {
        xlrTranslatorModule.startTranslating((err, res) => {

            if(err) {
                throw err;
            }
            if (res === 'indexed') {
                console.log(chalk.gray('Done ...'));
                return;
            }

            console.info('Created new translations ...')

        });
    }
});
