import { type JuxCliConfigOptions } from './config.types';
import { logger } from '../utils';
import { outdent } from 'outdent';
import { findConfig } from './find-config';
import { prettierFormat, FileManager } from '../fs';

export const DEFAULT_JUX_CONFIG: JuxCliConfigOptions = {
  tsx: true,
  styled_option: 'styled',
  components_directory: 'src/components/jux',
  tokens_directory: 'src/design-tokens',
  rsc: true,
};

export async function setupJuxConfig(
  cwd: string,
  options: JuxCliConfigOptions,
  forceOverwrite = false
): Promise<boolean> {
  const fs = new FileManager(cwd);
  const configFile = `jux.config.${options.tsx ? 'ts' : 'js'}`;

  const configPath = findConfig({ cwd });

  if (configPath && !forceOverwrite) {
    logger.warn(
      `config file already exists: ${configPath}. Use -f to overwrite.`
    );
    return false;
  } else {
    logger.info(`creating jux config file: ${configFile}`);
    const configContent = outdent`
      import { defineConfig } from '@jux/cli';

      export default defineConfig({
        /* Whether to pull components in tsx / jsx */
        tsx: true,

        /* The styled option to use */
        styled_option: 'styled',

        /* The directory to pull components into */
        components_directory: 'src/components/jux',

        /* The directory to pull design tokens into */
        tokens_directory: 'src/design-tokens',

        /* Whether to use rsc in pulled components */
        rsc: true,

        /* The tokens and themes for the design system */
        themes: {
          core: {
            color: {
              brand_100: {
                $value: '#0070f3',
                $description: 'Primary brand color',
              },
              brand_200: {
                $value: '#ff0080',
                $description: 'Secondary brand color',
              },
            },
          },
          myTheme: {
            color: {
              primary: {
                $value: '{core.color.brand_100}',
                $description: 'Should be the primary brand color',
              },
            },
          },
        },
      });
    `;

    fs.writeFile(cwd, configFile, await prettierFormat(configContent));
  }

  return true;
}
