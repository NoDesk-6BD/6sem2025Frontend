// app/layouts/default.vue
<template>
  <div class="flex">
    <Sidebar :collapsed="collapsed" />

    <main class="flex-1 min-h-screen bg-gray-100">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "../components/SideBar.vue";
import { useState } from "#imports";

const collapsed = useState("sidebar-collapsed", () => false);
</script>
