import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isLocal = mode === "development";
  const base = isLocal ? "/" : "/auth/";
  const origin = env.VITE_SERVER_ORIGIN || "http://localhost:3001";

  return {
    base,
    server: {
      host: "0.0.0.0",
      port: 3001,
      origin,
    },
    preview: {
      port: 4001,
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
        name: "auth",
        filename: "remoteEntry.js",
        exposes: {
          "./App": "./src/App.tsx",
        },
        shared: {
          react: { singleton: true },
          "react-dom": { singleton: true },
          "react-router-dom": { singleton: true },
          "@reduxjs/toolkit": { singleton: true },
        },
        dts: false,
      }),
    ],
    build: {
      target: "esnext",
    },
  };
});
