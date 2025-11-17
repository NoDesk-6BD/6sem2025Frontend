// app/plugins/maska.ts

import { vMaska } from "maska";

export default defineNuxtPlugin((nuxtApp) => {
  // Registra a diretiva 'v-maska' globalmente
  nuxtApp.vueApp.directive("maska", vMaska);
});
