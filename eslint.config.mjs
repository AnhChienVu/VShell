import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
  },
  {
    ignores: [
      "build/",
      "coverage/",
      "node_modules/",
      ".env",
      "*.config.js",
      "*.config.mjs",
      "examples/",
    ],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
];
