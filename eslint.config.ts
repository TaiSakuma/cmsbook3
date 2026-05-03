import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import vuePlugin from "eslint-plugin-vue";
import globals from "globals";
import * as tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";

const isProduction =
  import.meta.env?.PROD || process.env.NODE_ENV === "production";

export default [
  // Base recommended rules
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Vue files: parser + recommended rules
  {
    files: ["**/*.vue"],
    plugins: { vue: vuePlugin },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 2022,
        extraFileExtensions: [".vue"],
        sourceType: "module",
      },
    },
    rules: {
      ...vuePlugin.configs.recommended.rules,
      "vue/multi-word-component-names": "off",
      "vue/no-unused-components": "off",
    },
  },

  // Global rules
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser },
    },
    plugins: { prettier: prettierPlugin },
    rules: {
      "no-console": isProduction ? "warn" : "off",
      "no-debugger": isProduction ? "warn" : "off",
      "no-unused-labels": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "prettier/prettier": "warn",
    },
  },

  // Disables ESLint rules that conflict with Prettier — must be last
  prettierConfig,
];
