import { makeLoggerMiddleware } from 'inversify-logger-middleware';
import { makeValueMiddleware } from './value-middleware';
import { Container } from './container';

/**
 * Create the inversify container
 */
export function createContainer(): Container {
  const container = new Container();

  const middlewares = [];

  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'development') {
    const logger = makeLoggerMiddleware();
    middlewares.push(logger);
  }

  middlewares.push(makeValueMiddleware(container));
  container.applyMiddleware(...middlewares);
  return container;
}
