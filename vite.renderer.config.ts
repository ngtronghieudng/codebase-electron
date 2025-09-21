import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
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
