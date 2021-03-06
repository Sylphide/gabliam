import {
  PARAMETER_TYPE,
  METADATA_KEY,
  DEFAULT_PARAM_VALUE,
} from '../constants';
import { ControllerParameterMetadata, ParameterMetadata } from '../interfaces';

/**
 * Request decorator
 * Binds a method parameter to the request object.
 *
 * @param  {string} name name of specific request
 */
export const Request = paramDecoratorFactory(PARAMETER_TYPE.REQUEST);

/**
 * Response decorator
 * Binds a method parameter to the response object.
 *
 * @param  {string} name name of specific response
 */
export const Response = paramDecoratorFactory(PARAMETER_TYPE.RESPONSE);

/**
 * RequestParam decorator
 * Binds a method parameter to request.params object or to a specific parameter if a name is passed.
 *
 * @param  {string} name name of specific request.params
 */
export const RequestParam = paramDecoratorFactory(PARAMETER_TYPE.PARAMS);

/**
 * QueryParam decorator
 * Binds a method parameter to request.query or to a specific query parameter if a name is passed.
 *
 * @param  {string} name name of specific request.query
 */
export const QueryParam = paramDecoratorFactory(PARAMETER_TYPE.QUERY);

/**
 * RequestBody decorator
 *
 * Binds a method parameter to request.body or to a specific body property if a name is passed.
 * If the bodyParser middleware is not used on the express app,
 * this will bind the method parameter to the express request object.
 *
 * @param  {string} name name of specific body
 */
export const RequestBody = paramDecoratorFactory(PARAMETER_TYPE.BODY);

/**
 * RequestHeaders decorator
 *
 * Binds a method parameter to the request headers.
 *
 * @param  {string} name name of specific header
 */
export const RequestHeaders = paramDecoratorFactory(PARAMETER_TYPE.HEADERS);

/**
 * Cookies decorator
 *
 * Binds a method parameter to the request cookies.
 *
 * @param  {string} name name of specific cookie
 */
export const Cookies = paramDecoratorFactory(PARAMETER_TYPE.COOKIES);

/**
 * Next decorator
 *
 * Binds a method parameter to the next() function.
 */
export const Next = paramDecoratorFactory(PARAMETER_TYPE.NEXT);

function paramDecoratorFactory(
  parameterType: PARAMETER_TYPE
): (name?: string) => ParameterDecorator {
  return function(name: string = DEFAULT_PARAM_VALUE): ParameterDecorator {
    return Params(parameterType, name);
  };
}

/**
 * Params decorator
 *
 * generic decorator for params
 *
 * @param {PARAMETER_TYPE} type type of param
 * @param {string} parameterName name of param
 */
export function Params(
  type: PARAMETER_TYPE,
  parameterName: string
): ParameterDecorator {
  return function(
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    let metadataList: ControllerParameterMetadata;
    let parameterMetadataList: ParameterMetadata[] = [];
    const parameterMetadata: ParameterMetadata = {
      index: parameterIndex,
      parameterName: parameterName,
      type: type,
    };
    if (
      !Reflect.hasOwnMetadata(
        METADATA_KEY.controllerParameter,
        target.constructor
      )
    ) {
      metadataList = new Map();
    } else {
      metadataList = Reflect.getOwnMetadata(
        METADATA_KEY.controllerParameter,
        target.constructor
      );
      if (metadataList.has(propertyKey)) {
        parameterMetadataList = metadataList.get(propertyKey)!;
      }
    }
    parameterMetadataList.unshift(parameterMetadata);
    metadataList.set(propertyKey, parameterMetadataList);
    Reflect.defineMetadata(
      METADATA_KEY.controllerParameter,
      metadataList,
      target.constructor
    );
  };
}
