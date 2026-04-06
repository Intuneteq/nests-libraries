import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import { defineConfig } from "eslint/config"
import eslintPluginPrettier from "eslint-plugin-prettier/recommended"

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            globals: globals.node,
            parserOptions: {
                projectService: true
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
    }
])
