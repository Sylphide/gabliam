import * as _ from 'lodash';
import * as d from 'debug';
import * as shortstop from 'shortstop';
import * as handlers from 'shortstop-handlers';
import FileLoader from './file-loader';
import { LoaderConfigPgkNotInstalledError } from '../errors';

const debug = d('Gabliam:loader-config');

export type Loader = (options: any, profile?: string) => Promise<Object>;

export interface LoaderConfigOptions {
  /**
   * The loader
   * if string, require the loader
   */
  loader: string | Loader;

  /**
   * options passed on loader
   */
  options?: Object;
}

export class LoaderConfig {
  /**
   * Load configuration
   * @param  {string} folder the configuration folder
   * @returns any
   */
  async load(
    configPath: string,
    configOptions: string | LoaderConfigOptions[],
    profile = process.env.PROFILE || undefined
  ): Promise<any> {
    debug('load', configPath);

    let loaderConfigOptions: LoaderConfigOptions[];
    if (typeof configOptions === 'string') {
      loaderConfigOptions = [
        {
          loader: FileLoader,
          options: {
            folder: configOptions
          }
        }
      ];
    } else {
      loaderConfigOptions = configOptions;
    }

    const resolver = shortstop.create();
    resolver.use('file', handlers.file(configPath));
    resolver.use('path', handlers.path(configPath));
    resolver.use('base64', handlers.base64());
    resolver.use('env', handlers.env());
    resolver.use('require', handlers.require(configPath));
    resolver.use('exec', handlers.exec(configPath));
    resolver.use('glob', handlers.glob(configPath));

    let config = {};

    for (const { loader, options } of loaderConfigOptions) {
      let loaderFunc: Loader;

      if (typeof loader === 'string') {
        try {
          loaderFunc = require(loader).default;
        } catch {
          throw new LoaderConfigPgkNotInstalledError(loader);
        }
      } else {
        loaderFunc = loader;
      }
      const loadedConfig = await loaderFunc(options, profile);

      config = _.merge({}, config, loadedConfig);
    }

    debug('loadConfig', config);
    return new Promise((resolve, reject) => {
      resolver.resolve(config, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
