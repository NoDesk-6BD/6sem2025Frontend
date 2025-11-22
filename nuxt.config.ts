/* nuxt.config.ts */
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxt/test-utils"],
  css: [
    "~/assets/css/main.css",
    "@/assets/css/ComponentAssets/SideBar.css",
    "@/assets/css/ComponentAssets/MainContent.css",
  ],
  plugins: ["@/plugins/chart.js"],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },

  // Configuração do ESLint para ignorar regras
  eslint: {
    config: {
      typescript: {
        rules: {
          "@typescript-eslint/no-unused-vars": "off",
          "@typescript-eslint/no-explicit-any": "off",
        },
      },
    },
  },

  // Configuração dos testes unitários (bloco único e corrigido)
  testUtils: {
    environment: "nuxt",
    environmentOptions: {
      nuxt: { domEnvironment: "jsdom" },
    },
    dir: "tests",
    vue: {
      stubs: {
        UCard: true,
        ClientOnly: true,
      },
    },
    // Informa ao Vitest para usar nosso arquivo de preparação global
    vitestConfig: {
      test: {
        setupFiles: ["./tests/setup.ts"],
      },
    },
  },
});
