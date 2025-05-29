import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";

export default [
  {
    ignores: ["report/assets/scripts/vendor/**/*.js"],  // <-- виключення файлів тут
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        jQuery: "readonly",
        Raphael: "readonly",
        define: "readonly",
        __history: "writable",
        __report: "writable",
        CodeMirror: "readonly",
      },
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      jest: pluginJest,
    },
    rules: {
      ...pluginJest.configs.recommended.rules,
    },
    settings: {
      jest: {
        version: "latest",
      },
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["report/assets/scripts/**/*.js"],
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-redeclare": "off",
      "no-cond-assign": "off",
      "no-empty": "off",
      "no-func-assign": "off",
      "no-useless-escape": "off",
      "no-prototype-builtins": "off",
      "no-constant-binary-expression": "off",
      "no-fallthrough": "off",
    },
  },
];
