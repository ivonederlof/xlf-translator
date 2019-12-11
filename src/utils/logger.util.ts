import * as chalk from 'chalk';
import { Global } from '../common/global';

export class LoggerUtil {
  private _log = console.log;

  /**
   * Debug only when set to debug true in the config file
   * @param message
   */
  public debug(message: string) {
    if (!Global.config.debug) {
      return;
    }
    return this._log(chalk.gray(message));
  }

  /**
   * Debug only when set to debug true in the config file
   * @param message
   */
  public info(message: string) {
    return this._log(chalk.blue(message));
  }
}
