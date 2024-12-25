import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    keycloakify({
      accountThemeImplementation: "none",
      keycloakVersionTargets: {
        "all-other-versions": "mint-theme.jar",
        "22-to-25": false
      },
      themeName: "mint-theme",
      themeVersion: "1.0.0"
    })
  ]
});
