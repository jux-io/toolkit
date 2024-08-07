import * as CSS from 'csstype';

export function convertObjectToCSS(
  styles: Record<string, CSS.Properties>
): string {
  let cssString = '';

  for (const [selector, properties] of Object.entries(styles)) {
    cssString += `${selector} {\n`;
    for (const [property, value] of Object.entries(properties)) {
      if (value !== undefined) {
        const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
        cssString += `  ${cssProperty}: ${value};\n`;
      }
    }
    cssString += '}\n\n';
  }

  return cssString.trim();
}
