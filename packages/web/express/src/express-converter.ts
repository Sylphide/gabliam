import {
  Container,
  InjectContainer,
  INJECT_CONTAINER_KEY,
  Service,
  toPromise,
} from '@gabliam/core';
import {
  BadInterceptorError,
  createInterceptorResolver,
  getContext,
  getExtractArgs,
  isInterceptor,
} from '@gabliam/web-core';
import { express } from './express';

/**
 * Class for convert interceptor to Express Middleware
 */
@InjectContainer()
@Service()
export class ExpressConverter {
  public interceptorToMiddleware(clazz: any): express.RequestHandler {
    const container = <Container>(this as any)[INJECT_CONTAINER_KEY];
    const instance = createInterceptorResolver(container)(clazz);
    if (!isInterceptor(instance)) {
      throw new BadInterceptorError(instance);
    }

    const extractArgs = getExtractArgs(instance, 'intercept');

    return async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const args = extractArgs(getContext(req), null, next);

      try {
        await toPromise((instance['intercept'] as any)(...args));
        next();
      } catch (err) {
        next(err);
      }
    };
  }
}
