import { Constants } from './constants';
import { TranslatorConfig } from '../models/translator-config.model';

export namespace Global {
  export var root: string = process.cwd();
  export var config: TranslatorConfig = new TranslatorConfig(
    require([root, Constants.CONFIG_NAME].join('/')),
  );
}
