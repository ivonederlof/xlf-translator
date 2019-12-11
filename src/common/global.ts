import { Constants } from './constants';
import { TranslatorConfig } from '../models/translator-config.model';
import { LoggerUtil } from '../utils/logger.util';

export namespace Global {
  export var root: string = process.cwd();
  export var config: TranslatorConfig = new TranslatorConfig(
    require([root, Constants.CONFIG_NAME].join('/')),
  );
  export var logger: LoggerUtil = new LoggerUtil();
}
