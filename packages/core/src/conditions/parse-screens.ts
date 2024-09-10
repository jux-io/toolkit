import { JuxCLIConfig, Screen } from '../config';

export function parseScreens(
  screens?: JuxCLIConfig['screens']
): Record<string, string> {
  if (!screens) return {};

  return Object.fromEntries(
    Object.entries(screens).map(([key, value]) => [
      key,
      parseScreenValue(value),
    ])
  );
}

function parseScreenValue(value: string | Screen): string {
  if (typeof value === 'string') {
    return `@media (min-width: ${value})`;
  }

  if ('raw' in value) {
    return `@media ${value.raw}`;
  }

  const conditions: string[] = [];
  if ('min' in value) conditions.push(`(min-width: ${value.min})`);
  if ('max' in value) conditions.push(`(max-width: ${value.max})`);

  if ('min' in value && 'max' in value) {
    const minPx = parsePixelValue(value.min);
    const maxPx = parsePixelValue(value.max);
    if (minPx >= maxPx) {
      throw new Error(
        `Min width (${value.min}) must be less than max width (${value.max})`
      );
    }
  }

  return `@media ${conditions.join(' and ')}`;
}

function parsePixelValue(value: string): number {
  const match = value.match(/^(\d+(\.\d+)?)(px|em|rem|vh|vw)$/);
  if (!match) {
    throw new Error(
      `Invalid width value: ${value}. Must be a number followed by a valid CSS unit (px, em, rem, vh, vw).`
    );
  }
  return parseFloat(match[1]);
}
