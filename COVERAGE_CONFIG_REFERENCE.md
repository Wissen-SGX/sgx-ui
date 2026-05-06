# Coverage Configuration Reference

## Root vitest.workspace.ts

```typescript
export default [
  "packages/shared/vitest.config.ts",
  "packages/api-client/vitest.config.ts",
  "packages/query-client/vitest.config.ts",
  "packages/ui-components/vitest.config.ts",
  "apps/auth-app/vitest.config.ts",
  "apps/host-app/vitest.config.ts",
  "apps/index-studio-app/vitest.config.ts",
];
```

## Package vitest.config.ts Templates

### React App/Package Template (ui-components, auth-app, host-app, index-studio-app, query-client)

```typescript
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
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
      ],
    },
  },
});
```

### Node Library Template (shared, api-client)

```typescript
/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
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
```

## Key Configuration Options Explained

| Option               | Value                          | Reason                                              |
| -------------------- | ------------------------------ | --------------------------------------------------- |
| `globals: true`      | Enabled                        | Test functions (describe, it, expect) auto-imported |
| `environment`        | jsdom/node                     | jsdom for React, node for backend                   |
| `setupFiles`         | config/vitest/setup.ts         | Global test setup (@testing-library matchers)       |
| `include`            | src/\*_/_.{test,spec}.{ts,tsx} | Match all test files                                |
| `provider`           | v8                             | Fast, modern coverage tool                          |
| `reporter`           | [lcov, text, html]             | SonarQube (lcov), console (text), browser (html)    |
| `reportsDirectory`   | ../../coverage                 | Coverage reports location                           |
| `include` (coverage) | src/\*_/_.{ts,tsx}             | Only include source files in coverage               |
| `exclude` (coverage) | index, \*.d.ts, tests          | Exclude infrastructure files                        |

## Root Package.json Test Scripts

```json
{
  "scripts": {
    "test": "npm --workspaces --if-present run test",
    "test:watch": "npm --workspaces --if-present run test:watch",
    "test:coverage": "npm --workspaces --if-present run test:coverage",
    "test:coverage:watch": "npm --workspaces --if-present run test:coverage:watch",
    "coverage:report": "open coverage/index.html"
  }
}
```

## Coverage Report Outputs

After running `npm run test:coverage`, the `./coverage` folder contains:

```
coverage/
├── lcov.info              ← SonarQube reads this
├── lcov-report/
│   └── index.html         ← Open in browser
├── coverage-final.json    ← Detailed metrics
└── v8-files/              ← Internal V8 data
```

### LCOV Report (lcov.info)

- Machine-readable format for SonarQube
- Line-by-line coverage data
- Branch coverage metrics
- Function coverage metrics

### HTML Report (coverage/index.html)

- Interactive web interface
- Click into files to see line coverage
- Color-coded: green (covered), red (uncovered), yellow (partial)
- Summary statistics per file

## Adding .gitignore Entry

Ensure coverage folder is not committed:

```
# .gitignore
coverage/
```

## Environment Variables for SonarQube

```bash
export SONAR_HOST_URL="https://your-sonarqube-server"
export SONAR_TOKEN="your-token"
```

## Monorepo Coverage Aggregation

All 7 workspaces report to single `./coverage` folder:

- Prevents duplicate reports
- Enables single SonarQube scan
- Simplifies CI/CD pipeline
- Accurate project-wide metrics
