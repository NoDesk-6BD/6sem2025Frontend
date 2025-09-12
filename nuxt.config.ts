// https://nuxt.com/docs/api/configuration/nuxt-config
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
});
