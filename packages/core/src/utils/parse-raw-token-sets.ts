import { underscore } from './string-utils.ts';
import { walkObject } from './walk-object.ts';
import { isAlias } from '@juxio/design-tokens';
import { CORE_TOKEN_IDENTIFIER } from '../tokens';
import { TokenSet } from '../api';
import { type Themes } from '../config';

export function parseRawTokenSets(tokens: TokenSet[]) {
  return tokens.reduce((processedTokens, tokenSet) => {
    const tokenSetName = underscore(tokenSet.name);
    // It's safe to assume core is common among all token sets
    const modifiedTokenSet = walkObject(tokenSet.value, (key, value) => {
      if (key === '$extensions' || key === '$type') {
        return { type: 'remove' };
      }

      if (
        typeof value === 'string' &&
        isAlias(value) &&
        !value.startsWith(`{${CORE_TOKEN_IDENTIFIER}`)
      ) {
        return {
          type: 'replace',
          value: value.replace('{', `{${tokenSetName}.`),
        };
      }

      return { type: 'replace', value };
    });

    processedTokens.core = modifiedTokenSet.core;
    delete modifiedTokenSet.core;

    processedTokens[tokenSetName] = modifiedTokenSet;

    return processedTokens;
  }, {} as Themes);
}
