import {
  BaseProcessor,
  CallParam,
  IOptions,
  Params,
  TailProcessorParams,
  validateParams,
  ValueCache,
} from '@wyw-in-js/processor-utils';
import { Expression } from '@babel/types';
import { colorScheme, logger, stringifyCssObject } from '@juxio/core';
import { Rules, ValueType } from '@wyw-in-js/shared';
import { StylesDefinition } from '../styled';
import { parseRawStyleObject } from '@juxio/core';
import { CSSPropertiesWithCustomValues, css } from '@juxio/css';
import path from 'node:path';
import { TokensManager } from '@juxio/core';

// TODO: Duplicate type definition with css processor
export type ExtendedOptions = IOptions & {
  tokens: TokensManager;
};

export class StyledProcessor extends BaseProcessor {
  callParam: CallParam;

  constructor(params: Params, ...args: TailProcessorParams) {
    if (params.length < 2) {
      // no need to do any processing if it is an already transformed call or just a reference.
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

      this.dependencies.push(
        ...callArgs.filter((callArg) => callArg.ex.type !== 'StringLiteral')
      );
    }

    this.callParam = callParams;
  }

  build(values: ValueCache) {
    logger.debug(
      `Parsing styled ${colorScheme.debug(this.displayName)} function`
    );

    const [, ...callArgs] = this.callParam;

    callArgs.forEach((callArg, index) => {
      // Style object for styled function is always the 2nd
      if (index !== 1) {
        return;
      }

      if (callArg.kind === ValueType.LAZY) {
        const styleDefinition = values.get(callArg.ex.name) as StylesDefinition;

        const baseClassName = css(styleDefinition.root);

        const rootStyles = this.generateStyleObject(
          `.${baseClassName}`,
          styleDefinition.root
        );

        styleDefinition.variants?.forEach((variant) => {
          const variantClassName = css(variant.style);
          const variantStyles = this.generateStyleObject(
            `&.${variantClassName}`,
            variant.style
          );

          rootStyles[`.${baseClassName}`] = {
            ...rootStyles[`.${baseClassName}`],
            ...variantStyles,
          };
        });

        this.generateAssets(baseClassName, stringifyCssObject(rootStyles));
      }
    });
  }

  generateAssets(className: string, cssText: string) {
    const rules: Rules = {
      [`${className}`]: {
        className,
        cssText,
        displayName: this.displayName,
        start: this.location?.start ?? null,
      },
    };

    this.artifacts.push(['css', [rules, []]]);
  }

  generateStyleObject(
    className: string,
    styleObject: CSSPropertiesWithCustomValues
  ) {
    const { tokens } = this.options as ExtendedOptions;

    return {
      [`${className}`]: parseRawStyleObject(
        tokens,
        styleObject,
        (cssKey, value) => {
          logger.warn(
            `[${colorScheme.debug(path.basename(this.context.filename!))}]: Token value ${colorScheme.input(cssKey)}: "${colorScheme.input(value)}" was not found in ${colorScheme.debug(this.displayName)} function`
          );
        }
      ),
    };
  }

  doEvaltimeReplacement() {
    this.replacer(this.astService.stringLiteral(this.asSelector), false);
  }

  doRuntimeReplacement() {
    return;
  }

  public override get asSelector(): string {
    return `.${this.className}`;
  }

  get value(): Expression {
    return this.astService.stringLiteral(this.className);
  }
}
