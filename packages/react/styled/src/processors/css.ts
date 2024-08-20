import {
  BaseProcessor,
  CallParam,
  IOptions,
  Params,
  TailProcessorParams,
  validateParams,
  ValueCache,
} from '@wyw-in-js/processor-utils';
import type { Expression } from '@babel/types';
import { Rules, ValueType } from '@wyw-in-js/shared';
import merge from 'lodash/merge';
import { CSSPropertiesWithCustomValues } from '../base';
import css from '../css';
import { logger, stringifyCssObject, type TokensManager } from '@juxio/core';
import { parseRawStyleObject, colorScheme } from '@juxio/core';

export type ExtendedOptions = IOptions & {
  tokens: TokensManager;
};

export class CssProcessor extends BaseProcessor {
  callParam: CallParam;

  constructor(params: Params, ...args: TailProcessorParams) {
    if (params.length < 2) {
      throw BaseProcessor.SKIP;
    }
    super([params[0]], ...args);

    validateParams(
      params,
      ['callee', ['call']],
      `Invalid use of ${this.tagSource.imported} tag.`
    );

    const [, callParams] = params;

    if (callParams[0] === 'call') {
      const [, ...callArgs] = callParams;
      this.dependencies.push(...callArgs);
    }

    this.callParam = callParams;
  }

  build(values: ValueCache) {
    logger.debug(`Parsing css ${colorScheme.debug(this.displayName)} function`);
    const mergedStyled: CSSPropertiesWithCustomValues = {};

    const [, ...callArgs] = this.callParam;

    callArgs.forEach((callArg) => {
      let styleObject: CSSPropertiesWithCustomValues = {};
      // We currently supports lazy values only (no function call)
      if (callArg.kind === ValueType.LAZY) {
        styleObject = values.get(
          callArg.ex.name
        ) as CSSPropertiesWithCustomValues;
      }

      if (styleObject) {
        merge(mergedStyled, styleObject);
      }
    });

    if (Object.keys(mergedStyled).length > 0) {
      this.generateAssets(mergedStyled);
    }
  }

  generateAssets(styleObject: CSSPropertiesWithCustomValues) {
    const cssClassName = css(styleObject);

    const { tokens } = this.options as ExtendedOptions;

    const parsedStyle = parseRawStyleObject(tokens, styleObject, cssClassName);

    const cssText = stringifyCssObject({
      [`.${cssClassName}`]: parsedStyle,
    });

    const rules: Rules = {
      [`.${cssClassName}`]: {
        className: cssClassName,
        cssText,
        displayName: this.displayName,
        start: this.location?.start ?? null,
      },
    };

    this.artifacts.push(['css', [rules, []]]);
  }

  get asSelector() {
    return `.${this.className}`;
  }

  doEvaltimeReplacement() {
    return;
  }

  doRuntimeReplacement() {
    this.doEvaltimeReplacement();
  }

  get value(): Expression {
    return this.astService.stringLiteral(this.className);
  }
}
