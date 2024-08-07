import { CallExpression } from 'ts-morph';

export interface FunctionInfo {
  functionName: string;
  functionNode: CallExpression;
}

export interface FunctionMatcher {
  checkFn: (functionName: string) => boolean;
}

export interface ParserMatchers {
  functions: FunctionMatcher;
}
