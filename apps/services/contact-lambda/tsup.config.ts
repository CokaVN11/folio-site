import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/handler.ts'],
  format: ['esm'],
  target: 'node20',
  outDir: 'dist',
  clean: true,
  bundle: true,
  minify: true,
  sourcemap: false,
  treeshake: true,
  platform: 'node',
  external: ['@aws-sdk/*'],
});
