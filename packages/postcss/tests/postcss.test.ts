import { describe, it } from 'vitest';
import postcss from 'postcss';
import juxPlugin from '../src';
import { join, resolve } from 'node:path';

const root = resolve(join(__dirname, '../'));

const cwd = join(root, 'tests', 'sample-config');

describe('PostCSS plugin', () => {
  const processor = postcss([juxPlugin({ cwd })]);

  it('"from" file is from node_modules, should skip', async () => {
    const input = '@layer juxbase, juxtokens, juxutilities;';
    const result = await processor.process(input, {
      from: '/node_modules/test.css',
    });

    expect(result.css).toBe(input);
  });

  it('"from" file is not a css file, should skip', async () => {
    const input = '@layer juxbase, juxtokens, juxutilities;';
    const result = await processor.process(input, {
      from: 'test.js',
    });

    expect(result.css).toBe(input);
  });

  it('process css file', async () => {
    const input = '@layer juxbase, juxtokens, juxutilities;';
    const result = await processor.process(input, {
      from: '/test.css',
    });

    expect(result.css).toMatchFileSnapshot(`./__snapshots__/output.css`);
  });

  it('Plugin dependencies should include globs specified in config and config itself', async () => {
    const input = '@layer juxbase, juxtokens, juxutilities;';
    const result = await processor.process(input, {
      from: '/test.css',
    });

    expect(result.messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'dir-dependency',
          dir: join(cwd, 'src'),
          glob: '**/*.{js,jsx,ts,tsx}',
          plugin: '@juxio/postcss',
          parent: '/test.css',
        }),
        expect.objectContaining({
          type: 'dir-dependency',
          dir: join(cwd, 'pages'),
          glob: '**/*.{ts,tsx}',
          plugin: '@juxio/postcss',
          parent: '/test.css',
        }),
      ])
    );

    expect(result.messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'dependency',
          file: join(cwd, 'jux.config.ts'),
          plugin: '@juxio/postcss',
          parent: '/test.css',
        }),
      ])
    );
  });
});
