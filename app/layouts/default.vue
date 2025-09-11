<template>
  <div class="flex">
    <Sidebar :collapsed="collapsed" />

    <main
      class="flex-1 min-h-screen transition-all duration-300 bg-gray-100"
      :class="{ 'ml-64': !collapsed, 'ml-20': collapsed }"
    >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '../components/SideBar.vue'
import { useState } from '#imports'

const collapsed = useState('sidebar-collapsed', () => false)
</script>
