<template>
  <!-- app/app.vue -->
  <Html :class="colorMode.value">
    <Body class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <!-- UApp é essencial para o Nuxt UI funcionar corretamente (modais, toasts, etc) -->
      <UApp>
        <UNotifications />
        <!-- OBRIGATÓRIO: Sem isso, o toast.add() não funciona -->

        <TooltipProvider>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </TooltipProvider>
      </UApp>
    </Body>
  </Html>
</template>

<script setup>
import { TooltipProvider } from "reka-ui";
const colorMode = useColorMode();
</script>
