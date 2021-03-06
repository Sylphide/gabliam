import { Registry } from '../registry';
import { ValueValidator, PluginMetadata } from './metadata';
import { Container } from '../container';
import { LoaderConfigOptions } from '../loaders';
import { gabliamValue } from '@gabliam/core/src/promise-utils';

/**
 * Config for gabliam
 */
export interface GabliamConfig {
  /**
   * Path to scan
   */
  scanPath?: string;

  /**
   * Path of config
   */
  config?: string | LoaderConfigOptions[];
}

/**
 * Interface of plugin constructor
 */
export interface GabliamPluginConstructor {
  new (): GabliamPlugin;
}

export interface GabliamPluginDefinition extends PluginMetadata {
  plugin: GabliamPlugin;
}

/**
 * Interface for a plugin
 */
export interface GabliamPlugin {
  build?(container: Container, registry: Registry): gabliamValue<void>;

  bind?(container: Container, registry: Registry): gabliamValue<void>;

  config?(
    container: Container,
    registry: Registry,
    confInstance: any
  ): gabliamValue<void>;

  start?(container: Container, registry: Registry): gabliamValue<void>;

  stop?(container: Container, registry: Registry): gabliamValue<void>;

  destroy?(container: Container, registry: Registry): gabliamValue<void>;
}

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys];

export type GabliamPluginWithBuild = RequireOnlyOne<GabliamPlugin, 'build'>;

export type GabliamPluginWithBind = RequireOnlyOne<GabliamPlugin, 'bind'>;

export type GabliamPluginWithConfig = RequireOnlyOne<GabliamPlugin, 'config'>;

export type GabliamPluginWithStart = RequireOnlyOne<GabliamPlugin, 'start'>;

export type GabliamPluginWithStop = RequireOnlyOne<GabliamPlugin, 'stop'>;

export type GabliamPluginWithDestroy = RequireOnlyOne<GabliamPlugin, 'destroy'>;

/**
 * Value extractor
 */
export type ValueExtractor = (
  path: string,
  defaultValue: any,
  validator?: ValueValidator | null
) => any;
