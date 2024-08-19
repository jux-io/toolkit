import * as CSS from 'csstype';
import { DesignTokenTypeEnum } from '@juxio/design-tokens';
import { TokenInfo } from '../tokens';

export function getCategoryByCssProperty(
  property: keyof CSS.Properties | string
): TokenInfo['category'] {
  switch (property) {
    case 'fontSize':
      return DesignTokenTypeEnum.dimension;
    case 'fontFamily':
      return DesignTokenTypeEnum.fontFamily;
    case 'fontWeight':
      return DesignTokenTypeEnum.fontWeight;
    case 'lineHeight':
      return DesignTokenTypeEnum.dimension;
    case 'letterSpacing':
      return DesignTokenTypeEnum.dimension;
  }
}
