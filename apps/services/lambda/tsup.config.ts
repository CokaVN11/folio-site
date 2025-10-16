import { defineConfig } from 'tsup';
import { writeFileSync } from 'fs';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

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
  // Bundle all dependencies including AWS SDK
  onSuccess: async () => {
    // Copy the full package.json with all dependencies
    const originalPackageJson = JSON.parse(readFileSync('package.json', 'utf8'));

    // Create package.json with all production dependencies
    const lambdaPackageJson = {
      type: 'module',
      main: 'handler.js',
      dependencies: originalPackageJson.dependencies,
    };
    writeFileSync('dist/package.json', JSON.stringify(lambdaPackageJson, null, 2));

    // Install ALL dependencies in node_modules folder
    console.log('Installing all dependencies in dist folder...');
    execSync('npm install', { cwd: 'dist', stdio: 'inherit' });
  },
});
