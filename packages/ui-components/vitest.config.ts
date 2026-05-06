/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    name: "ui-components",
    globals: true,
    environment: "jsdom",
    setupFiles: [resolve(__dirname, "../../config/vitest/setup.ts")],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      exclude: ["src/index.ts", "src/styles/**", "src/declarations.d.ts"],
    },
  },
});
