import { TranslationHandler } from './handlers/translation.handler';
import { ValidationHandler } from './handlers/validation.handler';
import { XlfHandler } from './handlers/xlf.handler';

const xlfHandler = new XlfHandler();
const translatorHandler = new TranslationHandler();
const validationHandler = new ValidationHandler();

execute()
  .then(() => console.log('Done!'))
  .catch(console.error);

export function execute(): Promise<void> {
  return validationHandler
    .prepare()
    .then(xlfHandler.createXlfWorkSheet)
    .then((worksheet) => translatorHandler.translateAllMessages(worksheet))
    .then();
}

// translatorHandler
//     .many(['Hallo', 'Ik ben ivo', 'Ik heb zin in een koekje'], 'de')
//     .then((translated: Translated[]) => {
//         translated.map(tr => console.log('Translated -> ', tr.from, ' - ', tr.to));
//     })
//     .catch((error: Error) => {
//         console.error(error);
//     });
