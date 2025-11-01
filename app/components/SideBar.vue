// app/components/SideBar.vue
<template>
  <aside
    class="min-h-screen transition-all duration-300 flex flex-col fixed lg:relative z-10"
    :class="[collapsed ? 'w-20' : 'w-64']"
    style="background: linear-gradient(180deg, #192f4e 5%, #1c314f 100%)"
  >
    <div>
      <div
        class="p-4 flex items-center"
        :class="[collapsed ? 'justify-center' : 'justify-between']"
      >
        <div class="flex items-center gap-3 overflow-hidden">
          <span class="flex items-center justify-center">
            <UserCircle2 :size="40" class="text-white" />
          </span>
          <div
            v-if="!collapsed"
            class="text-white font-semibold whitespace-nowrap"
          >
            Usuário
          </div>
        </div>
        <button
          class="p-1.5 rounded-lg text-white hover:bg-neutral-700 transition"
          @click="collapsed = !collapsed"
        >
          <ChevronFirst :class="{ 'rotate-180': collapsed }" />
        </button>
      </div>
    </div>

    <nav class="flex-1 px-2">
      <ul>
        <li>
          <a
            href="#"
            class="flex items-center gap-3 p-3 hover:bg-neutral-700 text-white rounded transition"
            :class="[collapsed ? 'justify-center' : '']"
          >
            <span>
              <LayoutDashboard :size="28" class="text-white" />
            </span>
            <span v-if="!collapsed" class="font-medium whitespace-nowrap"
              >Dashboards</span
            >
          </a>
        </li>
      </ul>
    </nav>

    <div class="p-4 border-t border-slate-700">
      <button
        class="flex items-center gap-3 w-full p-2 hover:bg-red-700 text-white rounded transition"
        :class="[collapsed ? 'justify-center' : '']"
        @click="handleLogout"
      >
        <span>
          <LogOut :size="28" class="text-white" />
        </span>
        <span v-if="!collapsed" class="font-medium whitespace-nowrap"
          >Logout</span
        >
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  UserCircle2,
  LayoutDashboard,
  LogOut,
  ChevronFirst,
} from "lucide-vue-next";
import { useState } from "#imports";

const collapsed = useState("sidebar-collapsed");

function handleLogout() {
  console.log("Logout clicado");
}
</script>
