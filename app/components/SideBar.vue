<template>
  <div
    class="h-screen fixed top-0 left-0 transition-all duration-300 flex flex-col justify-between"
    :class="collapsed ? 'w-20' : 'w-64'"
    style="background-color: #2f373f"
  >
    <div class="p-4 flex justify-end" v-if="!collapsed">
      <button
        @click="collapsed = !collapsed"
        class="text-white text-2xl p-1 hover:bg-gray-700 rounded"
      >
        ☰
      </button>
    </div>
    <div class="p-4 flex justify-start" v-else>
      <button
        @click="collapsed = !collapsed"
        class="text-white text-2xl p-1 hover:bg-gray-700 rounded"
      >
        ☰
      </button>
    </div>

    <nav class="flex-1 mt-4">
      <ul>
        <li>
          <a
            href="#"
            class="flex items-center gap-3 p-4 hover:bg-gray-700 text-white rounded"
          >
            <span class="icon-dashboard text-xl">📊</span>
            <span v-if="!collapsed" class="font-medium">Dashboard</span>
          </a>
        </li>
      </ul>
    </nav>

    <div class="p-4">
      <button
        class="flex items-center gap-3 w-full p-2 hover:bg-gray-700 text-white rounded"
      >
        <span class="text-xl">🔒</span>
        <span v-if="!collapsed" class="font-medium">Logout</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useState } from '#imports'
const collapsed = useState('sidebar-collapsed')
</script>
