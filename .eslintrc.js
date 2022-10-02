module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: ["plugin:vue/essential", "@vue/prettier"],

  rules: {
    "no-console": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/no-unused-components": "off",
    "vue/multi-word-component-names": "off",
    "no-unused-labels": "off",
    "no-unused-vars": "off",
  },

  parserOptions: {
    parser: "@typescript-eslint/parser",
  },

  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],

  extends: ["plugin:vue/essential", "@vue/prettier", "@vue/typescript"],
};
