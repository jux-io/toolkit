import { UtilitiesConfig } from '../../config';
import { getAliasMatches, TypographyTokenValue } from '@juxio/design-tokens';
import { logger } from '../../utils';
import { CSSObject } from '../../config/plain-css-types.ts';

export const typography: UtilitiesConfig = {
  acceptedValues: 'typography',
  transform: (value: TypographyTokenValue[] | TypographyTokenValue, args) => {
    // Typogrphy must have a token
    if (args.tokens.length === 0) {
      return;
    }

    // If we have more than one value, it means this token is theme based and should be scoped to the theme
    if (!Array.isArray(value)) {
      return value;
    }

    const compositeTokens = args.tokensManager.getCompositeTokensByCategory();

    const { valuePath } = getAliasMatches(args.rawValue as string);

    if (!valuePath) {
      logger.warn(`Typography value is not a valid token name`);
      return;
    }

    const typographyCompositeTokens = compositeTokens.get('typography');

    if (!typographyCompositeTokens) {
      logger.warn(`Typography composite tokens not found`);
      return;
    }

    const compositeToken = typographyCompositeTokens.filter(
      (t) => t.finalizedTokenName === valuePath
    );

    return (
      compositeToken.length > 1
        ? compositeToken
            .map((t) => ({
              [`:where([data-theme="${t.themeName}"]) &`]: t.value,
            }))
            .reduce((acc, val) => ({ ...acc, ...val }), {})
        : compositeToken[0].value
    ) as CSSObject;
  },
};
