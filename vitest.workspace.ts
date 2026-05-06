// Vitest 4.x workspace — lists every package that has tests.
// Each entry points to that package's own vitest.config.ts.
// Run all: npm test (from root)
// Run one: npm --workspace packages/ui-components run test
export default [
  "packages/ui-components/vitest.config.ts",

  // Uncomment as tests are added to other packages/apps:
  // "packages/shared/vitest.config.ts",
  // "apps/index-studio-app/vitest.config.ts",
  // "apps/auth-app/vitest.config.ts",
];
