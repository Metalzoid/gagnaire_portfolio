import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/__tests__/setup.ts"],
    globalSetup: ["./src/__tests__/global-setup.ts"],
    include: ["src/**/*.test.ts"],
    testTimeout: 10_000,
    hookTimeout: 30_000,
    sequence: {
      concurrent: false,
    },
    env: {
      NODE_ENV: "test",
      JWT_SECRET: "test-jwt-secret-for-vitest-only",
      DATABASE_URL:
        "postgresql://portfolio:portfolio_dev@localhost:5432/portfolio_test_db",
    },
    coverage: {
      provider: "v8",
      include: [
        "src/services/**",
        "src/middlewares/**",
        "src/controllers/**",
      ],
      exclude: ["src/__tests__/**"],
    },
  },
});
