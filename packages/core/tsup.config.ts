import { defineConfig } from 'tsup';
import 'dotenv/config';

export default defineConfig({
  name: '@juxio/core',
  entry: ['./src/index.ts'],
  tsconfig: './tsconfig.json',
  format: ['cjs', 'esm'],
  splitting: false,
  dts: true,
  shims: true,
  clean: true,
  env: {
    API_SERVER: process.env.API_SERVER,
    CLIENT_ID: process.env.CLIENT_ID,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    API_AUDIENCE: process.env.API_AUDIENCE,
  },
});
