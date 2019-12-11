import { Worksheet } from '../models/worksheet.model';
import { Constants } from '../common/constants';
import { FileUtil } from '../utils/file.util';
import { Global } from '../common/global';
import { Message } from '../models/message.model';
import logger = Global.logger;

const config = Global.config;

export class XlfHandler {
  /**
   * Check if has all message files, otherwise create a copy of source
   * @private
   */
  public createXlfWorkSheet(): Promise<Worksheet> {
    logger.debug('\nGenerating a worksheet for files: \n');
    return Promise.all<Message>(
      config.toLanguages.map(iso => {
        const fileName = Global.config.localeFileName(iso);
        const path = [config.output, Constants.OUTPUT_DIRECTORY, fileName];
        logger.debug(`file: ${fileName}`);
        return FileUtil.copyFile([config.source], path).then(
          fileBuffer => new Message(path, fileBuffer, iso),
        );
      }),
    ).then(messages =>
      FileUtil.readFile([config.source]).then(source => {
        const sourceMessage = new Message([config.source], source, config.fromLanguage);
        return new Worksheet(messages, sourceMessage);
      }),
    );
  }
}
