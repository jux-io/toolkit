import { defineConfig } from 'tsup';

export default defineConfig({
  name: '@juxio/react-styled',
  entry: ['./src/**/*'],
  tsconfig: './tsconfig.json',
  format: ['cjs', 'esm'],
  splitting: false,
  dts: true,
  shims: true,
  clean: true,
});
