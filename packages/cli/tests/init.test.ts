import { runCommand } from '@oclif/test';
import { describe, it, expect, beforeAll } from 'vitest';
import { join, resolve } from 'node:path';
import fs from 'fs-extra';

const testsOutputDir = resolve(join(__dirname, './output/init'));
const root = resolve(join(__dirname, '../'));

describe('jux init', () => {
  beforeAll(() => {
    process.chdir(root);
    fs.mkdirSync(testsOutputDir, { recursive: true });
  });

  afterAll(() => {
    fs.removeSync(testsOutputDir);
  });

  it('Init', async () => {
    const { result } = await runCommand(
      [`init --cwd=${testsOutputDir} --skip-deps`],
      {
        root,
      }
    );

    expect(result).toBe(true);

    await expect(
      fs.readFileSync(join(testsOutputDir, 'jux.config.ts'), 'utf-8')
    ).toMatchFileSnapshot('./__snapshots__/jux.config.ts.snap');
  });

  it('Init but config already exists', async () => {
    // We need to use execSync as we need to capture the output, and oclif's runCommand doesn't support that
    const { result } = await runCommand(
      [`init --cwd=${testsOutputDir} --skip-deps`],
      {
        root,
      }
    );

    expect(result).toBe(false);

    await expect(
      fs.readFileSync(join(testsOutputDir, 'jux.config.ts'), 'utf-8')
    ).toMatchFileSnapshot('./__snapshots__/jux.config.ts.snap');
  });

  it('Init with force', async () => {
    // We need to use execSync as we need to capture the output, and oclif's runCommand doesn't support that
    const { result } = await runCommand(
      [`init --cwd=${testsOutputDir} --skip-deps -f`],
      {
        root,
      }
    );

    expect(result).toBe(true);

    await expect(
      fs.readFileSync(join(testsOutputDir, 'jux.config.ts'), 'utf-8')
    ).toMatchFileSnapshot('./__snapshots__/jux.config.ts.snap');
  });
});
