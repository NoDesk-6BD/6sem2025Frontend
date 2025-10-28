// vitest.config.ts
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",

    // 🔹 Arquivo que prepara mocks e stubs
    setupFiles: ["./tests/setup.ts"],

    // 🔹 Permite stubs de componentes UI (UCard, ClientOnly, etc.)
    deps: {
      inline: ["@vue", "chart.js"],
    },
  },
  resolve: {
    alias: {
      // ✅ Corrige caminhos Nuxt/Vue
      "~": fileURLToPath(new URL("./app", import.meta.url)),
      "@": fileURLToPath(new URL("./app", import.meta.url)),

      // ⚠️ Não aponte para `.d.ts`, pois não é um módulo executável.
      // Se precisar mockar #imports, já está sendo feito no setup.ts
      "#imports": fileURLToPath(
        new URL("./tests/mocks/nuxt-imports.ts", import.meta.url),
      ),
    },
  },
});
