import { Registry, GabliamPlugin, Container, Scan } from '@gabliam/core';
import { makeExecutableSchema } from 'graphql-tools';
import { TYPE, METADATA_KEY, DEBUG_PATH, GRAPHQL_CONFIG } from './constants';
import {
  ResolverMetadata,
  ControllerMetadata,
  GraphqlConfig
} from './interfaces';
import { IResolvers } from 'graphql-tools/dist/Interfaces';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as d from 'debug';
import { GraphQLSchema } from 'graphql';

const debug = d(DEBUG_PATH);

@Scan(__dirname)
export abstract class GraphqlCorePlugin implements GabliamPlugin {
  bind(container: Container, registry: Registry) {
    registry.get(TYPE.Controller).map(({ id, target }) => {
      container
        .bind<any>(id)
        .to(target)
        .inSingletonScope();
      return id;
    });
  }

  build(container: Container, registry: Registry) {
    const graphqlPluginConfig = container.get<GraphqlConfig>(GRAPHQL_CONFIG);
    const listdefinitions: string[] = [];

    if (graphqlPluginConfig.graphqlFiles) {
      listdefinitions.push(
        ...this.loadGraphqlFiles(...graphqlPluginConfig.graphqlFiles)
      );
    }

    const controllerIds = registry.get(TYPE.Controller);
    const resolverList: IResolvers[] = [];

    for (const { id: controllerId } of controllerIds) {
      const controller = container.get<object>(controllerId);

      const controllerMetadata: ControllerMetadata = Reflect.getOwnMetadata(
        METADATA_KEY.controller,
        controller.constructor
      );

      listdefinitions.push(...controllerMetadata.schema);
      listdefinitions.push(
        ...this.loadGraphqlFiles(...controllerMetadata.graphqlFiles)
      );

      const resolverMetadatas: ResolverMetadata[] = Reflect.getOwnMetadata(
        METADATA_KEY.resolver,
        controller.constructor
      );

      if (resolverMetadatas && controllerMetadata) {
        for (const resolverMetadata of resolverMetadatas) {
          if (resolverMetadata.schema) {
            listdefinitions.push(resolverMetadata.schema);
          }
          if (resolverMetadata.graphqlFile) {
            listdefinitions.push(
              ...this.loadGraphqlFiles(resolverMetadata.graphqlFile)
            );
          }

          resolverList.push(
            this.getResolver(container, controllerId, resolverMetadata)
          );
        }
      }
    }

    const queries = [];
    const mutations = [];
    const others = [];

    for (const definitions of listdefinitions) {
      const types = definitions
        .split('}')
        .map(s => s.replace(/^\s+|\s+$/g, '')) // remove space
        .filter(s => s !== '}' && s !== '') // remove usless
        .filter(s => s[0] !== '#') // remove commentaries lines
        .map(s => s + '\n}');

      for (let type of types) {
        if (/\s*type\s*Query\s*{\s*/g.test(type)) {
          if (type.slice(0, 6) !== 'extend') {
            // add extend
            type = `extend ${type}`;
          }
          queries.push(type);
        } else if (/\s*type\s*Mutation\s*{\s*/g.test(type)) {
          if (type.slice(0, 6) !== 'extend') {
            type = `extend ${type}`;
          }
          mutations.push(type);
        } else {
          others.push(type);
        }
      }
    }

    const typeDefs: string[] = [];
    // for first Type Query remove extend
    if (queries.length) {
      queries[0] = queries[0].slice(7);
      typeDefs.push(...queries);
    }

    if (mutations.length) {
      mutations[0] = mutations[0].slice(7);
      typeDefs.push(...mutations);
    }

    typeDefs.push(...others);

    const resolvers = <IResolvers>_.merge({}, ...resolverList);

    if (Object.keys(resolvers).length === 0) {
      return;
    }

    debug('typeDefs', typeDefs);
    const schema = <GraphQLSchema>(<any>makeExecutableSchema({
      typeDefs,
      resolvers
    }));

    this.registerMiddleware(container, registry, graphqlPluginConfig, schema);
  }

  abstract registerMiddleware(
    container: Container,
    registry: Registry,
    graphqlPluginConfig: GraphqlConfig,
    schema: GraphQLSchema
  ): void;

  private loadGraphqlFiles(...files: string[]) {
    return files.map(file => fs.readFileSync(file, 'UTF-8'));
  }

  private getResolver(
    container: Container,
    controllerId: any,
    resolverMetadata: ResolverMetadata
  ): IResolvers {
    const instance = container.get<any>(controllerId);
    const result: any = instance[resolverMetadata.key]();

    if (_.isFunction(result)) {
      // IResolverObject
      return _.set<IResolvers>(
        {},
        resolverMetadata.path,
        result.bind(instance)
      );
    } else {
      // GraphQLScalarType
      return _.set<IResolvers>({}, resolverMetadata.path, result);
    }
  }
}
