import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig([
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  ...nextVitals,
  ...nextTs,

  // Prettier integration — MUST come AFTER Next.js configs
  eslintPluginPrettierRecommended,

  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      // Force Prettier violations to show as errors (red squiggles)
      "prettier/prettier": "error"
    },
  },
]);
