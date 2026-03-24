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
        '**/main/**',
        '**/preload.ts',
        'dist/',
        'node_modules/',
        'src/renderer/assets/',
        'src/shared/definitions/',
        'tests/',
      ],
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    setupFiles: ['./tests/vitest.setup.ts'],
  },
});
