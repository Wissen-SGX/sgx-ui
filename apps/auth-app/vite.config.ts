import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isLocal = mode === 'development' || mode === 'local';
  const base = isLocal ? '/' : '/auth/';

  return {
    base,
    server: {
      port: 3001,
      origin: 'http://localhost:3001',
    },
    preview: {
      port: 4001,
    },
    resolve: {
      alias: {
        '@theme': resolve(__dirname, '../../packages/ui/src/styles/theme.css'),
      },
    },
    plugins: [
      react(),
      federation({
        name: 'auth',
        filename: 'remoteEntry.js',
        exposes: {
          './App': './src/App.tsx',
        },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true },
          'react-router-dom': { singleton: true },
          '@reduxjs/toolkit': { singleton: true },
        },
        dts: false,
      }),
    ],
    build: {
      target: 'esnext',
    },
  };
});
