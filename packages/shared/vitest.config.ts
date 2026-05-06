/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [resolve(__dirname, "../../config/vitest/setup.ts")],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["lcov", "text", "html"],
      reportsDirectory: resolve(__dirname, "../../coverage"),
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/index.ts",
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
      ],
    },
  },
});
