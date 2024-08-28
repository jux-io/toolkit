import { runCommand } from '@oclif/test';
import { describe, it, beforeAll, expect } from 'vitest';
import { join, resolve } from 'node:path';
import fs from 'fs-extra';
import nock from 'nock';
import { API_URL } from './setup';
import { TokenSet } from '@juxio/core';

const testsOutputDir = resolve(join(__dirname, './output/pull-tokens'));
const root = resolve(join(__dirname, '../'));

const TOKENS_RESPONSE = [
  {
    name: 'light',
    value: {
      core: {
        color: {
          brand_100: {
            $value: 'white',
          },
        },
        typography: {
          '12_bold': {
            $value: {
              fontSize: '12px',
              fontFamily: 'Inter',
              fontWeight: '700',
              lineHeight: '16px',
              letterSpacing: '',
            },
            $description: '',
          },
        },
      },
      color: {
        '+1': {
          $value: '{core.color.brand_100}',
        },
      },
      typography: {
        '12_bold': {
          $value: {
            fontSize: '12px',
            fontFamily: 'Inter',
            fontWeight: '700',
            lineHeight: '16px',
            letterSpacing: '',
          },
          $description: '',
        },
      },
    },
  },
  {
    name: 'dark',
    value: {
      core: {
        color: {
          brand_100: {
            $value: 'black',
          },
        },
        typography: {
          '12_bold': {
            $value: {
              fontSize: '12px',
              fontFamily: 'Inter',
              fontWeight: '700',
              lineHeight: '16px',
              letterSpacing: '',
            },
            $description: '',
          },
        },
      },
      color: {
        '+1': {
          $value: '{core.color.brand_100}',
        },
      },
      typography: {
        '12_bold': {
          $value: {
            fontSize: '12px',
            fontFamily: 'Inter',
            fontWeight: '700',
            lineHeight: '16px',
            letterSpacing: '',
          },
          $description: '',
        },
      },
    },
  },
] as TokenSet[];

// Pull token command needs the authentication config file, so modify the config directory it searches for
vi.stubEnv('JUX_CONFIG_DIR', testsOutputDir);

describe('jux pull tokens', () => {
  beforeAll(async () => {
    nock.disableNetConnect();
    process.chdir(root);
    fs.mkdirSync(testsOutputDir, { recursive: true });

    fs.copySync(
      join(root, 'tests', '__snapshots__', 'jux.config.pull.ts.snap'),
      join(testsOutputDir, 'jux.config.ts')
    );

    fs.copySync(
      join(root, 'tests', '__snapshots__', 'auth-config.json.snap'),
      join(testsOutputDir, 'config.json')
    );
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  afterAll(async () => {
    fs.removeSync(testsOutputDir);
  });

  it('Pull tokens', async () => {
    nock(API_URL)
      .get('/themes/token-sets')
      .query(true)
      .reply(200, TOKENS_RESPONSE);

    const { result } = await runCommand(
      [`pull tokens --cwd=${testsOutputDir}`],
      {
        root,
        configDir: testsOutputDir,
      }
    );

    expect(result).toBe(true);

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'tokens', 'index.ts'),
        'utf-8'
      )
    ).toMatchFileSnapshot('./__snapshots__/tokens/index.ts.snap');

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'tokens', 'dark.ts'),
        'utf-8'
      )
    ).toMatchFileSnapshot('./__snapshots__/tokens/dark.ts.snap');

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'tokens', 'light.ts'),
        'utf-8'
      )
    ).toMatchFileSnapshot('./__snapshots__/tokens/light.ts.snap');

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'tokens', 'core.ts'),
        'utf-8'
      )
    ).toMatchFileSnapshot('./__snapshots__/tokens/core.ts.snap');
  });

  it('Pull tokens with generate definitions flag', async () => {
    nock(API_URL)
      .get('/themes/token-sets')
      .query(true)
      .reply(200, TOKENS_RESPONSE);

    const { result } = await runCommand(
      [`pull tokens --definitions --cwd=${testsOutputDir}`],
      {
        root,
        configDir: testsOutputDir,
      }
    );

    expect(result).toBe(true);

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'tokens', 'index.ts'),
        'utf-8'
      )
    ).toMatchFileSnapshot('./__snapshots__/tokens/index.ts.snap');

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'tokens', 'dark.ts'),
        'utf-8'
      )
    ).toMatchFileSnapshot('./__snapshots__/tokens/dark.ts.snap');

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'tokens', 'light.ts'),
        'utf-8'
      )
    ).toMatchFileSnapshot('./__snapshots__/tokens/light.ts.snap');

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'tokens', 'core.ts'),
        'utf-8'
      )
    ).toMatchFileSnapshot('./__snapshots__/tokens/core.ts.snap');

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'types', 'tokens.d.ts'),
        'utf-8'
      )
    ).toMatchFileSnapshot(
      './__snapshots__/tokens/tokens.custom_values.d.ts.snap'
    );
  });
});