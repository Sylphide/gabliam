import { Gabliam } from '@gabliam/core';
import { GabliamTest } from '@gabliam/core/lib/testing';
import ExpressPlugin, { APP } from '@gabliam/express';
import * as e from 'express';
import GraphqlPlugin from '../src/index';

export class GraphqlPluginTest extends GabliamTest {
  public app: e.Application;

  constructor() {
    const gab = new Gabliam().addPlugin(ExpressPlugin).addPlugin(GraphqlPlugin);
    super(gab);
  }

  async build() {
    await super.build();
    this.app = this.gab.container.get<e.Application>(APP);
  }
}
