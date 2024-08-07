import { flatten, unflatten } from 'flat';
import { isEmpty, set } from 'lodash';
import { z } from 'zod';
import { supportedTokenTypes } from '../../../../constants';
import { getAliasMatches, isAlias } from '../../../../parser';
import { tokenSchema } from '../../../../schemas';
import {
  DesignTokens,
  DesignTokenValue,
  SupportedTokenTypes,
} from '../../../../types';

export const figmaTokenSetSchema = z.lazy(() =>
  z.object({
    global: z.record(z.string(), z.unknown()),
  })
);

export function transformFigmaTokens({
  tokenSet,
  group = 'imported',
}: {
  tokenSet: z.infer<typeof figmaTokenSetSchema>;
  group?: string;
}) {
  const flattenedTokenSet = Object.entries(
    flatten<typeof tokenSet.global, Record<string, string>>(tokenSet.global)
  );

  // resolving a value recursively - only for types that currently unsupported
  // it can either be an alias to a supported token type or a raw value
  const resolveTokenPropertyValue = (startValue?: string) => {
    let calls = 0;

    const tryResolveValue = (value?: string): string | undefined => {
      calls++;

      if (calls > flattenedTokenSet.length) {
        return undefined;
      }

      if (!isAlias(value)) {
        return value;
      } else {
        const { valuePath: tokenPath } = getAliasMatches(value);

        const [, resolvedValue] =
          flattenedTokenSet.find(
            ([path]) => path.endsWith('value') && path === `${tokenPath}.value`
          ) || [];

        // try resolving the alias
        return tryResolveValue(resolvedValue);
      }
    };

    return tryResolveValue(startValue);
  };

  const resolveTokenProperties = (tokenPath: string) =>
    (
      flattenedTokenSet.filter(([tokenValuePath]) =>
        // take all the properties of that token
        tokenValuePath.startsWith(`${tokenPath}.value`)
      ) || []
    ).map(([propertyFullPath, propertyValue]) => {
      const propertyRelativePath = propertyFullPath.replace(
        new RegExp(`^${tokenPath}[.]value[.]?`),
        ''
      );

      // if there are no properties either the token׳s value is an alias or a primitive raw value, preserve it
      if (isEmpty(propertyRelativePath)) {
        return {
          property: propertyRelativePath,
          value: propertyValue,
        };
      }

      // otherwise, resolving the value recursively for unsupported types
      return {
        property: propertyRelativePath,
        value: resolveTokenPropertyValue(propertyValue),
      };
    });

  const resolveTokenValue = (tokenPath: string) => {
    const properties = resolveTokenProperties(tokenPath);

    // no value
    if (properties.length === 0) {
      return undefined;
    }

    // primitive value
    if (properties.length === 1 && isEmpty(properties[0].property)) {
      return properties[0].value as DesignTokenValue;
    }

    // an object value
    return unflatten(
      properties.reduce(
        (acc, { property, value }) => ({ ...acc, [property]: value }),
        {}
      )
    ) as DesignTokenValue;
  };

  const resolveSupportedTokens = () =>
    flattenedTokenSet
      .filter(
        ([path, value]) =>
          path.endsWith('.type') &&
          supportedTokenTypes.includes(value as SupportedTokenTypes)
      )
      .map(([tokenTypePath, type]) => {
        const tokenPath = tokenTypePath.replace('.type', '');

        // an object
        return {
          type: type as SupportedTokenTypes,
          path: tokenPath,
          value: resolveTokenValue(tokenPath),
        };
      });

  // adjust the token paths and values to the system׳s design tokens format
  return resolveSupportedTokens().reduce(
    (systemTokens, { type, path, value }) => {
      function getSystemTokenPath(oldPath: string) {
        const tokenName = oldPath.split('.').join('_');

        return [type, group, tokenName];
      }

      // re-arrange the imported paths to be in the right format of the system׳s design tokens
      const systemTokenPath = getSystemTokenPath(path);

      // if the value is an alias, adjust it to the new token path and value
      if (!isAlias(value)) {
        const token = {
          $type: type,
          $value: value,
        };

        const tokenValidation = tokenSchema.safeParse(token);

        if (tokenValidation.success) {
          set(systemTokens, systemTokenPath, tokenValidation.data);
        }
      } else {
        const { valuePath } = getAliasMatches(value);

        const token = {
          $type: type,
          $value: value.replace(
            valuePath,
            getSystemTokenPath(valuePath).join('.')
          ),
        };

        set(systemTokens, systemTokenPath, token);
      }

      return systemTokens;
    },
    {} as DesignTokens
  );
}
