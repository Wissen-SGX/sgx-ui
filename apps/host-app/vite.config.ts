import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import { resolve } from 'path';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // serve = vite dev server (dev:all), build = any vite build
  // For builds without an env-file override (i.e. local/preview builds), default to preview ports.
  // Docker builds supply VITE_AUTH_APP_URL / VITE_INDEX_STUDIO_APP_URL via their .env.dev/uat/prod files.
  const authUrl =
    env.VITE_AUTH_APP_URL ||
    (command === 'serve' ? 'http://localhost:3001/remoteEntry.js' : 'http://localhost:4001/auth/remoteEntry.js');
  const indexStudioUrl =
    env.VITE_INDEX_STUDIO_APP_URL ||
    (command === 'serve' ? 'http://localhost:3002/remoteEntry.js' : 'http://localhost:4002/index-studio/remoteEntry.js');

  return {
    server: {
      port: 3000,
    },
    preview: {
      port: 4000,
    },
    resolve: {
      alias: {
        '@theme': resolve(__dirname, '../../packages/ui/src/styles/theme.css'),
      },
    },
    plugins: [
      react(),
      federation({
        name: 'host',
        remotes: {
          auth: {
            type: 'module',
            name: 'auth',
            entry: authUrl,
            entryGlobalName: 'auth',
            shareScope: 'default',
          },
          'index-studio': {
            type: 'module',
            name: 'index-studio',
            entry: indexStudioUrl,
            entryGlobalName: 'index-studio',
            shareScope: 'default',
          },
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
