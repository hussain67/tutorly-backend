// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist", "node_modules", "vitest.config.ts", "tests/**/*.ts"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module"
      }
    },
    rules: {
      // allow temporarily for Express error handlers
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
);

