import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
    exclude: ["node_modules/**"],
    reporters: ["verbose", "json"],
    outputFile: "test-reports/unit.json",
    coverage: {
      provider: "v8",
      reporter: ["text", "json"],
    },
  },
});
