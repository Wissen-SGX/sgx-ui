/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      "packages/shared/vitest.config.ts",
      "packages/api-client/vitest.config.ts",
      "packages/query-client/vitest.config.ts",
      "packages/ui-components/vitest.config.ts",
      "apps/auth-app/vitest.config.ts",
      "apps/host-app/vitest.config.ts",
      "apps/index-studio-app/vitest.config.ts",
    ],
    coverage: {
      provider: "v8",
      reporter: ["lcov", "text", "html"],
      reportsDirectory: "./coverage",
      include: [
        "packages/*/src/**/*.{ts,tsx}",
        "apps/*/src/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "packages/*/src/index.ts",
        "apps/*/src/index.ts",
        "apps/*/src/main.tsx",
        "apps/*/src/vite-env.d.ts",
        "packages/shared/src/styles/**",
        "packages/shared/src/declarations.d.ts",
        "packages/shared/src/test.d.ts",
      ],
    },
  },
});
