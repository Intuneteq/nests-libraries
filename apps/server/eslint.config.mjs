import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import { defineConfig } from "eslint/config"
import eslintPluginPrettier from "eslint-plugin-prettier/recommended"

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js, tseslint },
        extends: ["js/recommended"],
        languageOptions: {
            globals: { ...globals.node, ...globals.jest },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        }
    },
    eslintPluginPrettier,
    ...tseslint.configs.recommendedTypeChecked.map((config) => ({
        ...config,
        files: ["**/*.ts"] // We use TS config only for TS files
    })),
    {
        rules: {
            "capitalized-comments": ["warn", "always"],
            "no-unused-vars": "error"
        }
    },
    {
        files: ["**/*.{ts,mts,cts}"],
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-floating-promises": "warn",
            "@typescript-eslint/no-unsafe-argument": "warn"
        }
    }
])
