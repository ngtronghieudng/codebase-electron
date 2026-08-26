import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@@': path.resolve(__dirname, './'),
    },
  },
  test: {
    coverage: {
      exclude: [
        '**/*.config.*',
        '**/*.d.ts',
        'dist/',
        'docs/',
        'harness/',
        'locales/',
        'node_modules/',
        'tests/',
        'scripts/',
        'src/renderer/App.tsx',
        'src/renderer/AppRoutes.tsx',
        'src/renderer/assets/',
        'src/renderer/contexts/',
        'src/renderer/definitions/',
        'src/renderer/libs/',
        'src/renderer/main.tsx',
        'src/renderer/mocks/',
        'src/renderer/routes/',
      ],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        branches: 95,
        functions: 95,
        lines: 95,
        statements: 95,
      },
    },
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    setupFiles: ['./tests/vitest.setup.ts'],
  },
});
