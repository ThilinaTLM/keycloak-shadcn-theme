import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";
import * as path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    keycloakify({
      accountThemeImplementation: "none",
      keycloakVersionTargets: {
        "all-other-versions": "shadcn-theme.jar",
        "22-to-25": false
      },
      themeName: "shadcn-theme",
      themeVersion: "1.0.0"
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
