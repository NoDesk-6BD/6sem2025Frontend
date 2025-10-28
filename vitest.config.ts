import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "."), // Adiciona o alias para a raiz
      "@": path.resolve(__dirname, "."), // Adiciona o alias para a raiz
      "#imports": path.resolve(__dirname, "./.nuxt/imports.d.ts"), // Aponta para as definições de auto-import
    },
  },
});
