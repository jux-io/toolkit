import { z } from 'zod';
import { DesignTokenTypeEnum } from '../types';
import {
  DIMENSION_TOKEN_VALUE_REGEX,
  DIMENSION_TOKEN_VALUE_REGEX_MESSAGE,
  FONT_WEIGHT_VALUE_REGEX,
  FONT_WEIGHT_VALUE_REGEX_MESSAGE,
  COLOR_TOKEN_VALUE_REGEX,
  COLOR_TOKEN_VALUE_REGEX_MESSAGE,
  STROKE_STYLE_TOKEN_VALUE_REGEX,
  STROKE_STYLE_TOKEN_VALUE_REGEX_MESSAGE,
} from '../constants';

/* Token values */
export const colorTokenValueSchema = z
  .string()
  .regex(COLOR_TOKEN_VALUE_REGEX, COLOR_TOKEN_VALUE_REGEX_MESSAGE);

export const strokeStyleTokenValueSchema = z
  .string()
  .regex(
    STROKE_STYLE_TOKEN_VALUE_REGEX,
    STROKE_STYLE_TOKEN_VALUE_REGEX_MESSAGE
  );

export const dimensionTokenValueSchema = z
  .string()
  .regex(DIMENSION_TOKEN_VALUE_REGEX, DIMENSION_TOKEN_VALUE_REGEX_MESSAGE);

export const fontFamilyTokenValueSchema = z.string();

export const fontFamilyTokenAliasSchema = z.string();

export const fontWeightTokenValueSchema = z.string().regex(
  // this regex doesn't need to match the options in the UI, it should just be a valid CSS value
  FONT_WEIGHT_VALUE_REGEX,
  FONT_WEIGHT_VALUE_REGEX_MESSAGE
);

export const typographyTokenValueSchema = z.object({
  fontFamily: z.string().optional(),
  fontSize: z.string().optional(),
  fontWeight: z.string().optional(),
  letterSpacing: z.string().optional(),
  lineHeight: z.string().optional(),
});

export const aliasTokenValueSchema = z.string();

export const baseTokenSchema = z.object({
  $description: z.string().optional(),
  $extensions: z
    .object({
      createdAt: z.string().optional(),
    })
    .optional(),
});

export const colorTokenSchema = z.object({
  $type: z.literal(DesignTokenTypeEnum.color),
  $value: aliasTokenValueSchema.or(colorTokenValueSchema),
});

export const dimensionTokenSchema = z.object({
  $type: z.literal(DesignTokenTypeEnum.dimension),
  $value: aliasTokenValueSchema.or(dimensionTokenValueSchema),
});

export const typographyTokenSchema = z.object({
  $type: z.literal(DesignTokenTypeEnum.typography),
  $value: aliasTokenValueSchema.or(typographyTokenValueSchema),
});

export const borderTokenValueSchema = z.object({
  color: aliasTokenValueSchema.or(colorTokenValueSchema),
  width: aliasTokenValueSchema.or(dimensionTokenValueSchema),
  style: strokeStyleTokenValueSchema,
});

export const borderTokenSchema = z.object({
  $type: z.literal(DesignTokenTypeEnum.border),
  $value: aliasTokenValueSchema.or(borderTokenValueSchema),
});

export const tokenSchema = z.intersection(
  baseTokenSchema,
  z.discriminatedUnion('$type', [
    colorTokenSchema,
    dimensionTokenSchema,
    typographyTokenSchema,
    borderTokenSchema,
  ])
);
