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
   * @param color ()
   */
  public info(message: string, color: 'blue' | 'gray' | 'yellow' | 'blackBright' = 'blue') {
    return this._log(Object(chalk)[color](message));
  }

  /**
   * Make a custom log
   * @param message
   * @param optionalParams
   */
  public custom(message?: any, ...optionalParams: any[]) {
    return this._log(message);
  }
}
