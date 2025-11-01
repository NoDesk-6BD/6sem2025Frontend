// app.config.ts
import { defineAppConfig } from "nuxt/app";

export default defineAppConfig({
  title: "Hello Nuxt",
  theme: {
    dark: true,
    colors: {
      primary: "#19e6e6ff",
    },
  },
  ui: {
    notifications: {
      position: "top-0 end-0",
    },
  },
});
