import {
  DesignToken,
  DesignTokenTypeEnum,
  getCurrentTimestamp,
  SupportedTokenTypes,
} from '../';

export const CORE = 'core' as const;

export type DefaultStructuredTokenSet = Record<
  SupportedTokenTypes,
  DesignToken
>;

export type DefaultStructuredTokenSetWithCore = DefaultStructuredTokenSet &
  Record<typeof CORE, DefaultStructuredTokenSet>;

const getEmptyGroup = ({
  description,
  isLocked = false,
}: {
  description: string;
  isLocked?: boolean;
}): DesignToken => ({
  $description: description,
  $extensions: {
    createdAt: getCurrentTimestamp(),
    isLocked: isLocked,
  },
});

export const getDefaultStructuredTokenSet =
  (): DefaultStructuredTokenSetWithCore => ({
    [DesignTokenTypeEnum.color]: getEmptyGroup({
      description: 'Color tokens',
    }),
    [DesignTokenTypeEnum.dimension]: getEmptyGroup({
      description: 'Dimension tokens',
    }),
    [DesignTokenTypeEnum.fontFamily]: getEmptyGroup({
      description: 'Font family tokens',
    }),
    [DesignTokenTypeEnum.typography]: getEmptyGroup({
      description: 'Typography tokens',
    }),
    [DesignTokenTypeEnum.border]: getEmptyGroup({
      description: 'Border tokens',
    }),
    [CORE]: {
      ...getEmptyGroup({
        description: 'Core tokens',
      }),
      [DesignTokenTypeEnum.color]: getEmptyGroup({
        description: 'Color tokens',
      }),
      [DesignTokenTypeEnum.dimension]: getEmptyGroup({
        description: 'Dimension tokens',
      }),
      [DesignTokenTypeEnum.fontFamily]: getEmptyGroup({
        description: 'Font family tokens',
      }),
      [DesignTokenTypeEnum.typography]: getEmptyGroup({
        description: 'Typography tokens',
      }),
      [DesignTokenTypeEnum.border]: getEmptyGroup({
        description: 'Border tokens',
      }),
    },
  });
