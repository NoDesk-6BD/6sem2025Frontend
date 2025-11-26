/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // IMPORTANTE! Necessário para theme toggle funcionar

  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./app/**/*.{vue,js,ts}",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],

  theme: {
    extend: {},
  },

  plugins: [],
};
