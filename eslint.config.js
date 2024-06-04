// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  { ignores: ["eslint.config.js", "tsconfig.json", "node_modules/"] }
);
