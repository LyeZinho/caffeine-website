import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@content': path.resolve(__dirname, '../../content'),
      },
    },
    server: {
      port: 3000,
      fs: {
        allow: [path.resolve(__dirname, '../..')],
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/docs': {
          target: 'http://127.0.0.1:5173',
          changeOrigin: true,
        },
      },
    },
  };
});
