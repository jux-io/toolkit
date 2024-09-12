import { type JuxCLIConfig } from './config.types';
import { DesignTokensParser, DesignTokenTypeEnum } from '@juxio/design-tokens';
import { colorScheme, logger } from '../utils';
import { z } from 'zod';

// Helper function to parse and compare CSS units
const parseCSSUnit = (value: string): { number: number; unit: string } => {
  const match = value.match(/^(\d*\.?\d+)(\D+)$/);
  if (!match) throw new Error('Invalid CSS unit format');
  return { number: parseFloat(match[1]), unit: match[2] };
};

// Validator for CSS units
const cssUnitSchema = z
  .string()
  .refine(
    (value) =>
      /^\d*\.?\d+(px|em|rem|vh|vw|%|cm|mm|in|pt|pc|ex|ch|vmin|vmax)$/.test(
        value
      ),
    {
      message:
        'Invalid CSS unit format. Must be a number followed by a valid CSS unit (e.g., px, em, rem, vh, vw)',
    }
  );

// Schema for Screen type
const screenSchema = z.union([
  z.object({ raw: z.string() }),
  z.object({ min: cssUnitSchema }),
  z.object({ max: cssUnitSchema }),
  z
    .object({
      min: cssUnitSchema,
      max: cssUnitSchema,
    })
    .refine(
      (data) => {
        const min = parseCSSUnit(data.min);
        const max = parseCSSUnit(data.max);
        return min.unit === max.unit && min.number <= max.number;
      },
      {
        message: 'min must be less than or equal to max and have the same unit',
      }
    ),
]);

const UtilitiesSchema = z.record(
  z.string(),
  z.object({
    acceptedValues: z
      .union([
        z.array(z.string()),
        z.object({
          category: z.enum(
            Object.keys(DesignTokenTypeEnum) as [string, ...string[]]
          ),
        }),
      ])
      .optional(),
    transform: z.function(),
  })
);

export const tokensSchema = z.object({
  ...Object.values(DesignTokenTypeEnum).reduce(
    (acc, curr) => {
      acc[curr] = z.object({}).passthrough().optional();
      return acc;
    },
    {} as Record<string, z.ZodType>
  ),
  $description: z.string().optional(),
});

export const rawConfigSchema = z.object({
  preflight: z.boolean().optional().default(true),
  globalCss: z.record(z.string(), z.any()).optional(),
  builtInFonts: z
    .object({
      google: z.array(z.string()),
    })
    .optional(),
  cssVarsRoot: z.string().optional(),
  include: z.array(z.string()),
  exclude: z.array(z.string()).optional(),
  components_directory: z.string().optional(),
  tokens_directory: z.string().optional(),
  definitions_directory: z.string().optional(),
  core_tokens: tokensSchema,
  themes: z.record(z.string(), tokensSchema),
  screens: z
    .record(z.string(), z.union([cssUnitSchema, screenSchema]))
    .optional(),
  utilities: UtilitiesSchema.optional(),
});

export function validateConfig(config?: JuxCLIConfig) {
  if (!config) {
    throw new Error('Config must export a default object');
  }

  if (typeof config !== 'object') {
    throw new Error('Config must be an object');
  }

  const parseResult = rawConfigSchema.safeParse(config);

  if (!parseResult.success) {
    parseResult.error.errors.forEach((error) => {
      logger.error(
        `Config error in ${colorScheme.debug(error.path.join('.'))}: ${error.message}`
      );
    });

    throw new Error('Invalid config file');
  }

  // TODO: Make sure a color token can't reference a border token for example.
  // To do this we can collect all "color" category separately and try to resolve them.

  if (config.themes?.core) {
    throw new Error('Core tokens should not be defined in themes');
  }

  // TODO: Design tokens should return all errors in a single array, to prevent forcing the user to fix one error at a time.
  new DesignTokensParser({
    core: config.core_tokens ?? {},
    ...config.themes,
  });
  return true;
}
