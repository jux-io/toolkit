import { type Transformer } from './transformers';
import { parse, type ParserOptions } from '@babel/parser';
import { transformFromAstSync } from '@babel/core';
// @ts-expect-error - Missing types.
import transformTypescript from '@babel/plugin-transform-typescript';
import * as recast from 'recast';

const PARSE_OPTIONS: ParserOptions = {
  sourceType: 'module',
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  startLine: 1,
  tokens: true,
  plugins: [
    'asyncGenerators',
    'bigInt',
    'classPrivateMethods',
    'classPrivateProperties',
    'classProperties',
    'classStaticBlock',
    'decimal',
    'decorators-legacy',
    'doExpressions',
    'dynamicImport',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'functionBind',
    'functionSent',
    'importAssertions',
    'importMeta',
    'nullishCoalescingOperator',
    'numericSeparator',
    'objectRestSpread',
    'optionalCatchBinding',
    'optionalChaining',
    [
      'pipelineOperator',
      {
        proposal: 'minimal',
      },
    ],
    [
      'recordAndTuple',
      {
        syntaxType: 'hash',
      },
    ],
    'throwExpressions',
    'topLevelAwait',
    'v8intrinsic',
    'typescript',
    'jsx',
  ],
};

export const transformJsx: Transformer<string> = async ({
  sourceFile,
  config,
}) => {
  const output = sourceFile.getFullText();

  if (config.tsx) {
    return output;
  }

  const ast = recast.parse(output, {
    parser: {
      parse: (code: string) => {
        return parse(code, PARSE_OPTIONS);
      },
    },
  });

  const result = transformFromAstSync(ast, output, {
    cloneInputAst: false,
    code: false,
    ast: true,
    plugins: [transformTypescript],
    configFile: false,
  });

  if (!result || !result.ast) {
    throw new Error('Failed to transform JSX');
  }

  return recast.print(result.ast).code;
};
