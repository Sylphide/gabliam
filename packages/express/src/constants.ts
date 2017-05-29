/** Type in registry */
export const TYPE = {
  Controller: 'ControllerType',
};

export const METADATA_KEY = {
  controller: '_controller',
  controllerMethod: '_controller-method',
  middleware: '_middleware',
  MiddlewareConfig: '_middlewareConfig',
  MiddlewareErrorConfig: '_middlewareErrorConfig'
};

export const DEFAULT_ROUTING_ROOT_PATH = '/';

export const EXPRESS_PLUGIN_CONFIG = Symbol('GABLIAM/EXPRESS_PLUGIN_CONFIG');

export const APP = Symbol('GABLIAM/EXPRESS_APP');
export const SERVER = Symbol('GABLIAM/EXPRESS_SERVER');