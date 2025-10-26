<template>
  <div class="flex">
    <Sidebar :collapsed="collapsed" />

    <main
      class="flex-1 min-h-screen transition-all duration-300 bg-gray-100"
:class="{ 
        // Em telas pequenas (sm e menos), a margem é 0 (ou a sidebar deve ser overlay)
        'ml-0': true,
        // Em telas médias (md) e maiores, aplica-se a margem do layout desktop
        'md:ml-64': !collapsed, 
        'md:ml-20': collapsed
      }"
    >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "../components/SideBar.vue";
import { useState } from "#imports";

const collapsed = useState("sidebar-collapsed", () => false);
</script>
