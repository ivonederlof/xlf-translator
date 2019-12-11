import { Worksheet } from '../models/worksheet.model';
import { Constants } from '../common/constants';
import { FileUtil } from '../utils/file.util';
import { Global } from '../common/global';
import { XlfMessage } from '../models/xlf-message.model';

export class XlfHandler {
  /**
   * Check if has all message files, otherwise create a copy of source
   * @private
   */
  public createXlfWorkSheet(): Promise<Worksheet> {
    return Promise.all<XlfMessage>(
      Global.config.languageFileNames.map(fileName => {
        const path = [Global.config.output, Constants.XLF_OUTPUT_DIRECTORY, fileName];
        return FileUtil.copyFile([Global.config.source], path).then(
          fileBuffer => new XlfMessage(path, fileBuffer),
        );
      }),
    ).then(messages =>
      FileUtil.readFile([Global.config.source]).then(source => {
        const sourceMessage = new XlfMessage([Global.config.source], source);
        return new Worksheet(messages, sourceMessage);
      }),
    );
  }
}
