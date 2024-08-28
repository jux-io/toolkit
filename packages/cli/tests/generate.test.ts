import { runCommand } from '@oclif/test';
import { describe, it, expect, beforeAll } from 'vitest';
import { join, resolve } from 'node:path';
import fs from 'fs-extra';

const testsOutputDir = resolve(join(__dirname, './output/generate'));
const root = resolve(join(__dirname, '../'));

describe('jux generate', () => {
  beforeAll(async () => {
    process.chdir(root);
    fs.mkdirSync(testsOutputDir, { recursive: true });

    await runCommand([`init --cwd=${testsOutputDir} --skip-deps`], {
      root,
    });
  });

  afterAll(async () => {
    fs.removeSync(testsOutputDir);
  });

  it('generate token type definitions', async () => {
    const { result } = await runCommand([`generate --cwd=${testsOutputDir}`], {
      root,
    });

    expect(result).toBe(true);

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'types', 'tokens.d.ts'),
        'utf-8'
      )
    ).toMatchFileSnapshot('./__snapshots__/tokens.d.ts.snap');
  });
});
