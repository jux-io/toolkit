import { defineConfig } from 'tsup';

export default defineConfig({
  name: '@juxio/cli',
  entry: ['./src/**/*'],
  tsconfig: './tsconfig.json',
  format: ['cjs', 'esm'],
  splitting: false,
  dts: true,
  shims: true,
  clean: true,
  // TODO: Add env vars instead of env.json file
  env: {
    HELLO: process.env.PWD,
  },
});
