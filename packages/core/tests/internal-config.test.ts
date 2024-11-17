import {
  createInternalConfig,
  getInternalConfig,
  getAndVerifyInternalConfig,
  CONFIG_FILE,
  JuxInternalCliConfig,
} from '../src';
import fs from 'fs-extra';
import path from 'path';
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { join, resolve } from 'node:path';

const root = resolve(join(__dirname, '../'));
const configDir = join(root, 'tests', 'output');
const configPath = path.join(configDir, CONFIG_FILE);

describe('createInternalConfig', () => {
  const defaultConfig: JuxInternalCliConfig = {
    tokens: {
      access_token: '',
      refresh_token: '',
      expires_at: 0,
    },
    organizationId: 0,
  };

  afterEach(() => {
    if (fs.existsSync(configPath)) {
      fs.removeSync(configPath);
    }
  });

  it('creates a config file with default config if no config is provided', () => {
    createInternalConfig(configDir);

    expect(fs.existsSync(configPath)).toBe(true);
    const writtenConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(writtenConfig).toEqual(defaultConfig);
  });

  it('creates a config file with provided config', () => {
    const customConfig: JuxInternalCliConfig = {
      tokens: {
        access_token: 'custom_access_token',
        refresh_token: 'custom_refresh_token',
        expires_at: 1234567890,
      },
      organizationId: 123,
    };

    createInternalConfig(configDir, customConfig);

    expect(fs.existsSync(configPath)).toBe(true);
    const writtenConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(writtenConfig).toEqual(customConfig);
  });

  it('returns the default config', () => {
    const result = createInternalConfig(configDir);

    expect(result).toEqual(defaultConfig);
  });
});

describe('getInternalConfig', () => {
  const configContent = JSON.stringify({
    tokens: {
      access_token: 'token',
      refresh_token: 'refresh',
      expires_at: 1234567890,
    },
    organizationId: 123,
  });

  beforeEach(() => {
    fs.writeFileSync(configPath, configContent);
  });

  afterEach(() => {
    if (fs.existsSync(configPath)) {
      fs.removeSync(configPath);
    }
  });

  it('returns the parsed config if the file exists', () => {
    const result = getInternalConfig(configDir);

    expect(result).toEqual(JSON.parse(configContent));
  });

  it('throws an error if the config file does not exist', () => {
    fs.removeSync(configPath);

    expect(() => getInternalConfig(configDir)).toThrow(
      `Login configurations not found. Please run 'jux login'`
    );
  });

  it('throws an error for other read errors', () => {
    fs.chmodSync(configPath, 0o000);

    expect(() => getInternalConfig(configDir)).toThrow();
    fs.chmodSync(configPath, 0o644);
  });
});

describe('getAndVerifyInternalConfig', () => {
  const validConfig = {
    tokens: {
      access_token: 'token',
      refresh_token: 'refresh',
      expires_at: 1234567890,
    },
    organizationId: 123,
  };

  beforeEach(() => {
    fs.writeFileSync(configPath, JSON.stringify(validConfig));
  });

  afterEach(() => {
    if (fs.existsSync(configPath)) {
      fs.removeSync(configPath);
    }
  });

  it('returns the parsed and validated config if valid', () => {
    const result = getAndVerifyInternalConfig(configDir);

    expect(result).toEqual(validConfig);
  });

  it('throws an error if the config is invalid', () => {
    const invalidConfig = {
      tokens: {
        access_token: '',
        refresh_token: 'refresh',
        expires_at: 1234567890,
      },
      organizationId: 123,
    };
    fs.writeFileSync(configPath, JSON.stringify(invalidConfig));

    expect(() => getAndVerifyInternalConfig(configDir)).toThrow(
      'Invalid login configurations.'
    );
  });
});
