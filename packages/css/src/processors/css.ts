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
import { css } from '../css';
import path from 'node:path';
import {
  colorScheme,
  logger,
  parseRawStyleObject,
  stringifyCssObject,
  TokensManager,
  UtilitiesManager,
  ConditionsManager,
} from '@juxio/core';

export type ExtendedOptions = IOptions & {
  tokens: TokensManager;
  utilities: UtilitiesManager;
  conditions: ConditionsManager;
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

    const { tokens, utilities, conditions } = this.options as ExtendedOptions;

    const parsedStyle = parseRawStyleObject({
      tokens,
      utilities,
      conditions,
      baseStyles: styleObject,
      onTokenNotFound: (cssKey, value, valuePath) => {
        logger.warn(
          `[${colorScheme.debug(`${path.basename(this.context.filename!)} > ${this.displayName}`)}]: Token value ${colorScheme.debug(valuePath)} was not found in ${colorScheme.input(cssKey)}: "${colorScheme.input(value)}"`
        );
      },
      onError: (msg) => {
        logger.warn(
          `[${colorScheme.debug(`${path.basename(this.context.filename!)} > ${this.displayName}`)}]: ${msg}`
        );
      },
    });

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
