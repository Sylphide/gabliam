import { Gabliam } from '@gabliam/core';
import { GabliamTest } from '@gabliam/core/lib/testing';
import * as koa from 'koa';
import * as http from 'http';
import KoaPlugin, { APP } from '@gabliam/koa';
import GraphqlPlugin from '../src/index';
import * as supertest from 'supertest';

export class GraphqlPluginTest extends GabliamTest {
  public app: koa;

  constructor() {
    const gab = new Gabliam().addPlugin(KoaPlugin).addPlugin(GraphqlPlugin);
    super(gab);
  }

  async build() {
    await super.build();
    this.app = this.gab.container.get<koa>(APP);
    this.app.silent = true;
  }

  supertest() {
    return supertest.agent(http.createServer(this.app.callback()));
  }
}
