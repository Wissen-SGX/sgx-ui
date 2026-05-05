import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const devHost = env.VITE_DEV_HOST || "localhost";
  const isLocalDev = mode === "development";

  // ec2 + *-preview: absolute URL so the browser fetches assets from the correct preview port
  // direct deploy modes (dev / uat / production): relative path for Nginx proxy
  const base = isLocalDev
    ? "/"
    : mode === "ec2" || mode.endsWith("-preview")
      ? `http://${devHost}:4002/index-studio/`
      : "/index-studio/";

  // For '-preview' modes (e.g. dev-preview), Vite won't load '.env.dev'.
  // Load the base mode's env vars and inject via define so import.meta.env stays correct.
  const define: Record<string, string> = {};
  if (mode.endsWith("-preview")) {
    const baseMode = mode.replace(/-preview$/, "");
    const baseEnv = loadEnv(baseMode, process.cwd(), "");
    for (const [k, v] of Object.entries(baseEnv)) {
      if (k.startsWith("VITE_")) {
        define[`import.meta.env.${k}`] = JSON.stringify(v);
      }
    }
  }

  return {
    base,
    define,
    server: {
      host: "0.0.0.0",
      port: 3002,
      origin: env.VITE_SERVER_ORIGIN || "http://localhost:3002",
      cors: true,
    },
    preview: {
      port: 4002,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "@layout": resolve(__dirname, "./src/components/Layout"),
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
        name: "index-studio",
        filename: "remoteEntry.js",
        exposes: {
          "./App": "./src/App.tsx",
        },
        shared: {
          react: { singleton: true },
          "react-dom": { singleton: true },
          "react-router-dom": { singleton: true },
          "@reduxjs/toolkit": { singleton: true },
          "react-redux": { singleton: true },
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
