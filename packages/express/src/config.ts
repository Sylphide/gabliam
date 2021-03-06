import { PluginConfig, Bean, Value, Joi } from '@gabliam/core';
import { DEFAULT_ROUTING_ROOT_PATH, EXPRESS_PLUGIN_CONFIG } from './constants';
import { ExpressPluginConfig } from './interfaces';

@PluginConfig()
export class RestPluginConfig {
  @Value('application.express.rootPath', Joi.string())
  rootPath = DEFAULT_ROUTING_ROOT_PATH;

  @Value('application.express.port', Joi.number().positive())
  port: number = process.env.PORT ? parseInt(process.env.PORT!, 10) : 3000;

  @Value('application.express.hostname', Joi.string())
  hostname!: string;

  @Bean(EXPRESS_PLUGIN_CONFIG)
  restConfig(): ExpressPluginConfig {
    return {
      rootPath: this.rootPath,
      port: this.port,
      hostname: this.hostname
    };
  }
}
