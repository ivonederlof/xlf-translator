const xlfFileProcessor = require('./lib/xlf-file-processor');
const xlfProcessor = require('./lib/xlf-processor');

start();

function start() {

    xlfFileProcessor.doesHaveFiles('./files/messages', (err, messagesExists) => {
        if (messagesExists) {
            console.warn('found message files, started indexing manual translations');
            xlfProcessor.translateFileFromManualCsvDirectory((err) => {
                if (err) {
                    console.error(err);
                }
                console.log('re-indexed your translations')
            })
        } else {
            console.warn('did not find any messages, started translating with google ...');
            xlfProcessor.translateFileWithGoogleApi((err) => {
                if (err) {
                    console.error(err);
                }
                console.log('created new translations')
            });
        }
    });
}





