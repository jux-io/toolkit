import { runCommand } from '@oclif/test';
import {
  describe,
  it,
  expect,
  beforeAll,
  vi,
  afterAll,
  afterEach,
} from 'vitest';
import { join, resolve } from 'node:path';
import fs from 'fs-extra';
import nock from 'nock';
import { ComponentFileStructure } from '@juxio/core/src';
import { API_URL } from './setup';

const testsOutputDir = resolve(join(__dirname, './output/pull-components'));
const root = resolve(join(__dirname, '../'));

// Pull components command needs the authentication config file, so modify the config directory it searches for
vi.stubEnv('JUX_CONFIG_DIR', testsOutputDir);

describe('jux pull components', () => {
  beforeAll(async () => {
    nock.disableNetConnect();
    process.chdir(root);
    fs.mkdirSync(testsOutputDir, { recursive: true });

    fs.copySync(
      join(root, 'tests', 'sample-config', 'jux.config.ts'),
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

  it('Pull all components', async () => {
    nock(API_URL)
      .get((uri) => uri.includes('/library'))
      .query(true)
      .reply(200, [
        {
          name: 'Button',
          dependencies: [],
          file: {
            name: 'Button',
            content: 'export const Button = () => <button>Button</button>',
          },
        },
        {
          name: 'Div',
          dependencies: [],
          file: {
            name: 'Div',
            content: 'export const Div = () => <div>Button</div>',
          },
        },
      ] as ComponentFileStructure[]);

    await runCommand([`pull components --cwd=${testsOutputDir}`], {
      root,
      configDir: testsOutputDir,
    });

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'components', 'Button.tsx'),
        'utf-8'
      )
    ).toMatchFileSnapshot('./__snapshots__/Button.tsx.snap');

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'components', 'Div.tsx'),
        'utf-8'
      )
    ).toMatchFileSnapshot('./__snapshots__/Div.tsx.snap');
  });

  it('Pull all components to specific folder [relative path]', async () => {
    nock(API_URL)
      .get((uri) => uri.includes('/library'))
      .query(true)
      .reply(200, [
        {
          name: 'Button',
          dependencies: [],
          file: {
            name: 'Button',
            content: 'export const Button = () => <button>Button</button>',
          },
        },
        {
          name: 'Div',
          dependencies: [],
          file: {
            name: 'Div',
            content: 'export const Div = () => <div>Button</div>',
          },
        },
      ] as ComponentFileStructure[]);

    await runCommand(
      [`pull components --cwd=${testsOutputDir} --directory=./src/jux/folder`],
      {
        root,
        configDir: testsOutputDir,
      }
    );

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'folder', 'Button.tsx'),
        'utf-8'
      )
    ).toMatchFileSnapshot('./__snapshots__/Button.tsx.snap');

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'folder', 'Div.tsx'),
        'utf-8'
      )
    ).toMatchFileSnapshot('./__snapshots__/Div.tsx.snap');
  });

  it('Pull all components to specific folder [absolute path]', async () => {
    nock(API_URL)
      .get((uri) => uri.includes('/library'))
      .query(true)
      .reply(200, [
        {
          name: 'Button',
          dependencies: [],
          file: {
            name: 'Button',
            content: 'export const Button = () => <button>Button</button>',
          },
        },
        {
          name: 'Div',
          dependencies: [],
          file: {
            name: 'Div',
            content: 'export const Div = () => <div>Button</div>',
          },
        },
      ] as ComponentFileStructure[]);

    await runCommand(
      [
        `pull components --cwd=${testsOutputDir} --directory=${join(testsOutputDir, 'src', 'jux', 'folder')}`,
      ],
      {
        root,
        configDir: testsOutputDir,
      }
    );

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'folder', 'Button.tsx'),
        'utf-8'
      )
    ).toMatchFileSnapshot('./__snapshots__/Button.tsx.snap');

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'folder', 'Div.tsx'),
        'utf-8'
      )
    ).toMatchFileSnapshot('./__snapshots__/Div.tsx.snap');
  });

  it('Pull specific component', async () => {
    nock(API_URL)
      .get((uri) => uri.includes('/library'))
      .query({
        organizationId: '1',
        components: 'Input',
      })
      .reply(200, [
        {
          name: 'Input',
          dependencies: [],
          file: {
            name: 'Input',
            content: 'export const Input = () => <input />',
          },
        },
      ] as ComponentFileStructure[]);

    await runCommand([`pull components -c Input --cwd=${testsOutputDir}`], {
      root,
      configDir: testsOutputDir,
    });

    await expect(
      fs.readFileSync(
        join(testsOutputDir, 'src', 'jux', 'components', 'Input.tsx'),
        'utf-8'
      )
    ).toMatchFileSnapshot('./__snapshots__/Input.tsx.snap');
  });
});
