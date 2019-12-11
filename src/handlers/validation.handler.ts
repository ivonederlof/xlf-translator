import { FileUtil } from '../utils/file.util';
import { Global } from '../common/global';
import { Constants } from '../common/constants';
import logger = Global.logger;

export class ValidationHandler {
  /**
   * Prepare the process
   */
  public prepare(): Promise<void> {
    return FileUtil.createManyDirectories([
      FileUtil.createPath([Global.config.output, Constants.OUTPUT_DIRECTORY]),
    ]).then(() => logger.debug(`Has a valid ${Global.config.source} structure, proceeding ...`));
  }
}
