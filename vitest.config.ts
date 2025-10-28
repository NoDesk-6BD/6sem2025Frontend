import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    // Adicione esta seção para simular componentes globais do NuxtUI
    vue: {
      stubs: {
        UCard: true,
        ClientOnly: true,
        // Adicione aqui qualquer outro componente global que cause avisos
      },
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "."),
      "@": path.resolve(__dirname, "."),
      "#imports": path.resolve(__dirname, "./.nuxt/imports.d.ts"),
    },
  },
});
