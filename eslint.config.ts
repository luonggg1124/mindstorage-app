import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
   {
    rules: {
      "react/react-in-jsx-scope": "off"
    }
  },
  {
    ignores: [
            "node_modules/",
            ".husky/",
            ".vscode/",
            "src/components/ui/",
            "postcss.config.cjs",
            "tailwind.config.cjs",
            ".prettierrc.cjs",
            "vite.config.ts",
            "components.json",
            "src/components/animations"
        ]
  }
]);
