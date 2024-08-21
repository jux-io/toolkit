/* eslint-disable @typescript-eslint/no-explicit-any */

import { hypenateProperty, unitlessProperties } from './unitless-properties';

export type Dict<T = any> = Record<string, T>;

/* Grab object prototype to compare in the loop */
const toString = Object.prototype.toString;

export const BEFORE_PARENT = 'before_parent:';

/**
 * Returns a string of CSS from an object of CSS.
 * @example
 * stringifyCssObject({
 *   '.typography-body': {
 *     fontSize: 'var(--core-color-brand_100)',
 *     fontFamily: 'Arial',
 *     fontWeight: '200',
 *     lineHeight: '1px',
 *     letterSpacing: 1.5
 *   }
 * }) // '.typography-body { font-size: var(--core-color-brand_100); font-family: Arial; font-weight: 200; line-height: 1px; letter-spacing: 1.5; }'
 */
export function stringifyCssObject(
  /** Style object defintion. */
  value: Dict
) {
  /** Set used to manage the opened and closed state of rules. */
  const used = new Set<string[] | string>();

  const write = (
    cssText: string,
    selectors: string[],
    conditions: string[],
    name: string,
    data: string | number | boolean,
    isAtRuleLike: boolean,
    isVariableLike: boolean
  ) => {
    if (data === false) return '';

    // Add conditions
    conditions.forEach((c) => {
      if (!used.has(c)) {
        used.add(c);
        cssText += `${c} {`;
      }
    });

    // Then selectors
    if (selectors.length && !used.has(selectors)) {
      used.add(selectors);
      cssText += `${selectors.map((s) => s.replace('& ', ''))} {`;
    }

    let value = data;

    if (typeof value === 'number') {
      const shouldAddPx = !(
        value === 0 ||
        unitlessProperties.has(name) ||
        isVariableLike
      );
      if (shouldAddPx) {
        value = `${value}px`;
      }
    }

    // Format property
    if (isAtRuleLike) {
      name = `${name} `;
    } else if (isVariableLike) {
      name = `${name}: `;
    } else {
      name = `${hypenateProperty(name)}: `;
    }

    // Add it to the CSS string
    cssText += `${name + String(value)};\n`;

    return cssText;
  };

  const parse = (style: Dict, selectors: string[], conditions: string[]) => {
    let cssText = '';

    for (const name in style) {
      const isAtRuleLike = name.startsWith('@');
      const isVariableLike = !isAtRuleLike && name.startsWith('--');

      const rules = (
        isAtRuleLike && Array.isArray(style[name]) ? style[name] : [style[name]]
      ) as (string | Dict)[];

      for (const data of rules) {
        // Declaration rule (no nested rules), just property and value
        if (!(typeof data === 'object' && data && data.toString === toString)) {
          cssText = write(
            cssText,
            selectors,
            conditions,
            name,
            data as string | number,
            isAtRuleLike,
            isVariableLike
          );
          continue;
        }

        // Closing selector block
        if (used.has(selectors)) {
          used.delete(selectors);

          cssText += '}';
        }

        // This ensures a unique reference with `String("xxx")` even if the same string "xxx" is used multiple times
        const usedName = Object(name);

        let nextSelectors: typeof selectors;

        // Nested condition
        if (isAtRuleLike) {
          nextSelectors = selectors;
          cssText += parse(data, nextSelectors, conditions.concat(usedName));
        } else {
          // Nested selector rule
          const nestedSelectors = parseSelectors(name);
          nextSelectors = selectors.length
            ? getResolvedSelectors(selectors as string[], nestedSelectors)
            : nestedSelectors;
          cssText += parse(data, nextSelectors, conditions);
        }

        // Closing nested condition block
        if (used.has(usedName)) {
          used.delete(usedName);
          cssText += '}\n';
        }

        // Closing nested selector block
        if (used.has(nextSelectors)) {
          used.delete(nextSelectors);
          cssText += '}\n';
        }
      }
    }

    return cssText;
  };

  return parse(value, [], []);
}

/**
 * Returns a list of separated selectors from a selector string.
 * @example
 * parseSelectors('a, button') // ['a', 'button']
 * parseSelectors('.switch:is(:checked, [data-checked]).dark, .dark .switch:is(:checked, [data-checked])') // ['.switch:is(:checked, [data-checked]).dark', '.dark .switch:is(:checked, [data-checked])']
 * parseSelectors('&:is(:disabled, [disabled], [data-disabled]), .another') // [':is(:disabled, [disabled], [data-disabled])', '.another']
 */
export function parseSelectors(selector: string): string[] {
  const result = [] as string[];
  let parenCount = 0;
  let currentSelector = '';
  let inEscape = false;

  [...selector].forEach((char) => {
    if (char === '\\' && !inEscape) {
      inEscape = true;
      currentSelector += char;
      return;
    }

    if (inEscape) {
      inEscape = false;
      currentSelector += char;
      return;
    }

    if (char === '(') {
      parenCount++;
    } else if (char === ')') {
      parenCount--;
    }

    if (char === ',' && parenCount === 0) {
      result.push(currentSelector.trim());
      currentSelector = '';
    } else {
      currentSelector += char;
    }
  });

  if (currentSelector) {
    result.push(currentSelector.trim());
  }

  return result;
}

const parentSelectorRegex = /&/g;
const descendantSelectorRegex = /[ +>|~]/g;
const surroundedRegex = /&.*&/g;

/**
 * Returns selectors resolved from parent selectors and nested selectors.
 * @example
 * getResolvedSelectors(['a', 'button'], ['&:hover', '&:focus']) // ['a:hover', 'a:focus', 'button:hover', 'button:focus']
 * getResolvedSelectors(['.switch:is(:checked, [data-checked]).dark, .dark .switch:is(:checked, [data-checked])'], ['&:hover', '&:focus']) // ['.switch:is(:checked, [data-checked]).dark:hover', '.switch:is(:checked, [data-checked]).dark:focus', '.dark .switch:is(:checked, [data-checked]):hover', '.dark .switch:is(:checked, [data-checked]):focus']
 *
 */
const getResolvedSelectors = (
  /** Parent selectors (e.g. `["a", "button"]`). */
  parentSelectors: string[],
  /** Nested selectors (e.g. `["&:hover", "&:focus"]`). */
  nestedSelectors: string[]
) => {
  const resolved = [] as string[];

  parentSelectors.forEach((parentSelector) => {
    resolved.push(
      ...nestedSelectors.map((selector) => {
        /** In some cases we need to add the nested selector before the parent, for example in theming:
         * ```
         *    [data-jux-theme="light"] .jux-ca3901 {
         *         font-size: var(--core-dimension-spacing_30);
         *         font-family: Arial;
         *         font-weight: 200;
         *         line-height: 80px;
         *         letter-spacing: 0;
         *     }
         *
         *     [data-jux-theme="dark"] .jux-ca3901 {
         *         font-size: var(--core-dimension-spacing_20);
         *         font-family: Arial;
         *         font-weight: 200;
         *         line-height: 80px;
         *         letter-spacing: 0;
         *     }
         *     ```
         */
        if (selector.startsWith(BEFORE_PARENT))
          return selector.replace(BEFORE_PARENT, '') + ' ' + parentSelector;
        if (!selector.includes('&')) return parentSelector + ' ' + selector;

        return selector.replace(
          parentSelectorRegex,
          descendantSelectorRegex.test(parentSelector) &&
            surroundedRegex.test(selector)
            ? `:is(${parentSelector})`
            : parentSelector
        );
      })
    );
  });

  return resolved;
};
