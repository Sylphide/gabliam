import * as esprima from 'esprima';
import { ExpressionStatement } from 'estree';
import { Expression } from './expression';
import * as _ from 'lodash';

export class ExpressionParser {
  static eval(input: string, vars: object = {}) {
    const expressionParser = new ExpressionParser({});
    return expressionParser.parseExpression(input).getValue(vars);
  }

  private context: object;

  constructor(context: object = {}) {
    this.context = _.cloneDeep(context);
  }

  parseExpression(input: string) {
    const program = esprima.parseScript(input);
    const ast = (<ExpressionStatement>program.body[0]).expression;
    return new Expression(ast, this.context);
  }
}
