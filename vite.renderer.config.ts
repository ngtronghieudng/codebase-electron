import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-antd': ['antd'],
          'vendor-form': ['react-hook-form', '@hookform/resolvers', 'yup'],
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-state': ['zustand', '@tanstack/react-query'],
          'vendor-utils': [
            'axios',
            'dayjs',
            'lodash-es',
            'i18next',
            'react-i18next',
          ],
        },
      },
    },
    sourcemap: false,
  },

  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/renderer/assets/styles/root/variables";
          @import "@/renderer/assets/styles/root/mixins";
        `,
      },
    },
  },

  plugins: [react(), svgr()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@@': path.resolve(__dirname, './'),
    },
  },
});
