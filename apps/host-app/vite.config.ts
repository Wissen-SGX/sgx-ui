import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { resolve } from "path";

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const devHost = env.VITE_DEV_HOST || "localhost";

  // VITE_AUTH_APP_URL / VITE_INDEX_STUDIO_APP_URL are set only in direct deploy modes:
  //   dev / uat / production  →  .env.dev/.env.uat/.env.production  →  /auth/remoteEntry.js  (Nginx relative)
  //   ec2                     →  .env.ec2 (no URL override)         →  template uses VITE_DEV_HOST
  //   dev-preview / uat-preview / production-preview → no env file  →  localhost absolute (local vite preview)
  const authUrl =
    env.VITE_AUTH_APP_URL ||
    (command === "serve"
      ? `http://${devHost}:3001/remoteEntry.js`
      : `http://${devHost}:4001/auth/remoteEntry.js`);
  const indexStudioUrl =
    env.VITE_INDEX_STUDIO_APP_URL ||
    (command === "serve"
      ? `http://${devHost}:3002/remoteEntry.js`
      : `http://${devHost}:4002/index-studio/remoteEntry.js`);

  return {
    server: {
      host: "0.0.0.0",
      port: 3000,
    },
    preview: {
      port: 4000,
    },
    resolve: {
      alias: {
        "@theme": resolve(
          __dirname,
          "../../packages/ui-components/src/styles/theme.css",
        ),
        "@sgx-assets": resolve(
          __dirname,
          "../../packages/ui-components/assets",
        ),
      },
    },
    plugins: [
      react(),
      federation({
        name: "host",
        remotes: {
          auth: {
            type: "module",
            name: "auth",
            entry: authUrl,
            entryGlobalName: "auth",
            shareScope: "default",
          },
          "index-studio": {
            type: "module",
            name: "index-studio",
            entry: indexStudioUrl,
            entryGlobalName: "index-studio",
            shareScope: "default",
          },
        },
        shared: {
          react: { singleton: true },
          "react-dom": { singleton: true },
          "react-router-dom": { singleton: true },
          "@reduxjs/toolkit": { singleton: true },
          "@tanstack/react-query": { singleton: true },
        },
        dts: false,
      }),
    ],
    build: {
      target: "esnext",
    },
  };
});
