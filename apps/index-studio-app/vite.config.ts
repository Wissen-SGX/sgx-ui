import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import { resolve } from 'path';

export default defineConfig(({ mode, command }) => {
  const isLocalDev = mode === 'development' || mode === 'local';
  // 'vite build' with no --mode flag → mode='production' → start:local
  // 'vite build --mode dev-preview' → start:dev/uat/prod
  const isPreviewBuild = command === 'build' && (mode === 'production' || mode.endsWith('-preview'));
  const base = isLocalDev ? '/' : isPreviewBuild ? 'http://localhost:4002/index-studio/' : '/index-studio/';

  // For '-preview' modes (e.g. 'dev-preview'), Vite won't load '.env.dev'.
  // Load the base mode's env vars and inject via define so import.meta.env stays correct.
  const define: Record<string, string> = {};
  if (mode.endsWith('-preview')) {
    const baseMode = mode.slice(0, -'-preview'.length);
    const baseEnv = loadEnv(baseMode, process.cwd(), '');
    for (const [k, v] of Object.entries(baseEnv)) {
      if (k.startsWith('VITE_')) {
        define[`import.meta.env.${k}`] = JSON.stringify(v);
      }
    }
  }

  return {
    base,
    define,
    server: {
      port: 3002,
      origin: 'http://localhost:3002',
    },
    preview: {
      port: 4002,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@layout': resolve(__dirname, './src/components/layout'),
        '@theme': resolve(__dirname, '../../packages/ui/src/styles/theme.css'),
      },
    },
    plugins: [
      react(),
      federation({
        name: 'index-studio',
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
