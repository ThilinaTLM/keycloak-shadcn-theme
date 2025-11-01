import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist/**", "public/**", "src/components/ui/**"]
  },
  {
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js, "react-hooks": reactHooks, "react-refresh": reactRefresh },
    extends: [js.configs.recommended, tseslint.configs.recommended, pluginReact.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      "react/react-in-jsx-scope": "off"
    }
  }
]);
