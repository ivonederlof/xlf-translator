import { FileUtil } from '../utils/file.util';
import { Global } from '../common/global';
import { Constants } from '../common/constants';
import logger = Global.logger;
import config = Global.config;
import { Languages } from '../common/languages';

export class ValidationHandler {
  /**
   * Prepare the process
   */
  public prepare(): Promise<void> {
    return FileUtil.createManyDirectories([
      FileUtil.createPath([Global.config.output, Constants.OUTPUT_DIRECTORY]),
    ])
      .then(() =>
        Languages.hasValidLanguages([...config.toLanguages, config.fromLanguage]),
      )
      .then(() => logger.debug(`Has a valid ${config.source} structure, proceeding ...`));
  }
}
