import { Service } from '@gabliam/core';
import {
  AfterResponseInterceptor,
  Interceptor,
  InterceptorConstructor,
  InterceptorMethod,
  UseInterceptors,
} from '@gabliam/web-core';
import { METADATA_KEY } from './constants';
import { koaRouter } from './koa';

/**
 * Test if target is an koa interceptor
 * @param target any
 */
export const isKoaInterceptor = (target: any) =>
  Reflect.getOwnMetadata(
    METADATA_KEY.koaInterceptor,
    target.constructor || target
  ) === true;

/**
 * KoaInterceptor decorator
 * class is an koa interceptor.
 * Must return koaRouter middleware
 */
const KoaInterceptor = () => (target: any) => {
  Reflect.defineMetadata(METADATA_KEY.koaInterceptor, true, target);
};

/**
 * Convert a Koa router middleware to an express interceptor
 */
export const toInterceptor = (
  mid: koaRouter.IMiddleware,
  type: InterceptorMethod = 'intercept'
): InterceptorConstructor => {
  let clazz: InterceptorConstructor;
  if (type === 'intercept') {
    clazz = class implements Interceptor {
      intercept() {
        return mid;
      }
    };
  } else {
    clazz = class implements AfterResponseInterceptor {
      afterResponse() {
        return mid;
      }
    };
  }
  Service()(clazz);
  KoaInterceptor()(clazz);
  return clazz;
};

/**
 * Alias for evict to use: UseInterceptors(toInterceptor(koaMid))
 */
export const UseKoaInterceptors = (...mids: koaRouter.IMiddleware[]) =>
  UseInterceptors(...mids.map(m => toInterceptor(m)));
