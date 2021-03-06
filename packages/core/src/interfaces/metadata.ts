import { interfaces } from 'inversify';
import { Joi } from '../joi';
import { GabliamPluginConstructor } from './interfaces';

/**
 * Bean metadata
 */
export interface BeanMetadata {
  /**
   * Id of the bean
   */
  id: interfaces.ServiceIdentifier<any>;

  /**
   * Key of method
   */
  key: string;
}

/**
 * Value validator
 *
 * For customize error
 */
export interface ValueValidator {
  /**
   * Joi Schema
   */
  schema: Joi.Schema;

  /**
   * Indicate if throw an error when validation fail
   * default: true
   */
  throwError?: boolean;

  /**
   * Error message if you want custom this
   */
  customErrorMsg?: string;

  /**
   * option of Joi
   * @see Joi.ValidationOptions
   */
  options?: Joi.ValidationOptions;
}

export interface ValueMetadata {
  path: string;
  key: string;

  target: any;

  validator: ValueValidator | null;
}

/**
 * Represents a value in the registry
 */
export interface ValueRegistry<T = any> {
  id: interfaces.ServiceIdentifier<any>;

  target: any;

  options?: T;
}

/**
 * Config registry
 */
export interface ConfigRegistry {
  order: number;
}

export interface PreDestroyRegistry {
  preDestroys: Array<string | symbol>;
}

/**
 * Registry metadata
 */
export interface RegistryMetada<T = any> {
  type: string | symbol;

  value: ValueRegistry<T>;
}

/**
 * Plugin dependency
 */
export interface PluginDependency {
  name: string | GabliamPluginConstructor;

  order: 'before' | 'after';
}

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  name: string;

  dependencies: PluginDependency[];
}
