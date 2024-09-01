import { logger } from '../utils';
import { outdent } from 'outdent';
import { writeFileSync } from 'node:fs';
import path from 'path';

export function generatePostCSSConfig(cwd: string) {
  logger.debug('Generating postcss.config.js');
  const content = outdent`
module.exports = {
  plugins: {
    '@juxio/postcss': {},
  },
}
  `;

  return writeFileSync(path.join(cwd, 'postcss.config.js'), content, 'utf-8');
}
