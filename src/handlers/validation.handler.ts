import { FileHandler } from './file.handler';
import { FileUtil } from '../utils/file.util';
import { Global } from '../common/global';
import { Constants } from '../common/constants';

export class ValidationHandler {
  private _fileHandler = new FileHandler();

  /**
   * Prepare the process
   */
  public prepare(): Promise<void> {
    return this._fileHandler
      .hasSourceFile()
      .then(() =>
        FileUtil.createManyDirectories([
          FileUtil.createPath([Global.config.output, Constants.XLF_OUTPUT_DIRECTORY]),
        ]),
      )
      .then(() => console.log('Validated folder/file structure'));
  }
}
