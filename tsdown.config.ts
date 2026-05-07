import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/main.ts', 'src/index.ts', 'src/cli.ts'],
  format: ['esm'],
  dts: true,
  hash: false,
});
