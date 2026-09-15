import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Flat config (ESLint 9). Replaces the legacy .eslintrc.json, which ESLint 9
// can no longer load — `next lint` was also removed in Next 16, so `npx
// eslint app lib` is the lint entry point now.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "codes/**",
    "scripts/**",
    "test-reports/**",
    // These are assembly fragments, not standalone TypeScript modules.
    "data/_new-*",
  ]),
  {
    rules: {
      // Existing codebase predates these stylistic rules; keep them visible
      // as warnings without failing the errors-only lint gate.
      "react/no-unescaped-entities": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "warn",
      "prefer-const": "off",
      "@typescript-eslint/no-require-imports": "off",
      // React 19 compiler rules — downgrade to warn for standard patterns
      // (hydration guards, mount effects, localStorage sync), mirroring
      // worksheetgen-c's config.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/refs": "warn",
    },
  },
]);

export default eslintConfig;
