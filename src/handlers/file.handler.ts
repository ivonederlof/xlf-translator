import { FileUtil } from '../utils/file.util';
import { Global } from '../common/global';
import { Errors, TranslatorError } from '../common/translator-error';

export class FileHandler {
  /**
   * Check if there is a source file the project a.k.a messages.xlf
   * @private
   */
  public hasSourceFile(): Promise<boolean | Error> {
    return FileUtil.hasFile([Global.config.source])
      .then(isPresent => isPresent)
      .catch(() => {
        throw TranslatorError.throwError(Errors.NO_TRANSLATOR_CONFIG_PRESENT);
      });
  }
}
