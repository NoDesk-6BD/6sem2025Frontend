<template>
  <div
    class="h-screen fixed top-0 left-0 w-64 flex flex-col justify-between"
    style="background: linear-gradient(180deg, #192f4e 5%, #1c314f 100%)"
  >
    <!-- Usuário no topo -->
    <div class="p-5 flex items-center gap-3 border-b border-slate-700">
      <span
        class="flex items-center justify-center"
        style="width: 40px; height: 40px"
      >
        <UserCircle2 :size="40" class="text-white" />
      </span>
      <div>
        <div class="text-white font-semibold">Usuário</div>
        <div class="text-slate-400 text-xs">user@email.com</div>
      </div>
    </div>

    <!-- Navegação -->
    <nav class="flex-1 mt-3">
      <ul>
        <li>
          <a
            href="#"
            class="flex items-center gap-3 p-4 hover:bg-neutral-700 text-white rounded transition"
          >
            <span>
              <LayoutDashboard :size="28" class="text-white" />
            </span>
            <span class="font-medium">Dashboards</span>
          </a>
        </li>
        <!-- Adicione mais opções aqui -->
      </ul>
    </nav>

    <!-- Logout -->
    <div class="p-6 border-t border-slate-700">
      <button
        class="flex items-center gap-3 w-full p-2 hover:bg-red-700 text-white rounded transition"
      >
        <span>
          <LogOut :size="28" class="text-white" />
        </span>
        <span class="font-medium">Logout</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserCircle2, LayoutDashboard, LogOut } from "lucide-vue-next";
</script>
