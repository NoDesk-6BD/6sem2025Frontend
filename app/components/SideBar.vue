<template>
  <!-- app/components/SideBar.vue -->
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
          <span
            v-if="!collapsed"
            class="flex items-center justify-center font-medium whitespace-nowrap"
          >
            <UserCircle2 :size="40" class="text-white" />
          </span>
          <div
            v-if="!collapsed"
            class="text-white font-semibold whitespace-nowrap flex flex-col"
          >
            <!-- SIMULAÇÃO DO NOME/PERFIL -->
            <span>{{ currentUserName }}</span>
            <span class="text-xs text-gray-300 font-normal capitalize">{{
              currentUserRole
            }}</span>
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

    <!-- NAVEGAÇÃO ATUALIZADA -->
    <nav class="flex-1 px-2">
      <ul>
        <!-- Link para o Dashboard Principal -->
        <li>
          <NuxtLink
            to="/dashboard"
            class="flex items-center gap-3 p-3 hover:bg-neutral-700 text-white rounded transition"
            :class="[collapsed ? 'justify-center' : '']"
            active-class="bg-neutral-700"
          >
            <span>
              <LayoutDashboard :size="28" class="text-white" />
            </span>
            <span v-if="!collapsed" class="font-medium whitespace-nowrap"
              >Dashboards</span
            >
          </NuxtLink>
        </li>

        <!-- Link para Clientes -->
        <li class="mt-2">
          <NuxtLink
            to="/customers"
            class="flex items-center gap-3 p-3 hover:bg-neutral-700 text-white rounded transition"
            :class="[collapsed ? 'justify-center' : '']"
            active-class="bg-neutral-700"
          >
            <span>
              <Users :size="28" class="text-white" />
            </span>
            <span v-if="!collapsed" class="font-medium whitespace-nowrap"
              >Clientes</span
            >
          </NuxtLink>
        </li>

        <!-- NOVO LINK PARA CADASTRO DE USUÁRIOS (VALIDADO) -->
        <!-- O link só aparece se o usuário NÃO for 'viewer' -->
        <li v-if="canManageUsers" class="mt-2">
          <NuxtLink
            to="/users"
            class="flex items-center gap-3 p-3 hover:bg-neutral-700 text-white rounded transition"
            :class="[collapsed ? 'justify-center' : '']"
            active-class="bg-neutral-700"
          >
            <span>
              <UserCheck :size="28" class="text-white" />
            </span>
            <span v-if="!collapsed" class="font-medium whitespace-nowrap"
              >Usuários</span
            >
          </NuxtLink>
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
import { ref, computed, onMounted } from "vue"; // Adicione 'computed' e 'ref'
import {
  UserCircle2,
  LayoutDashboard,
  LogOut,
  ChevronFirst,
  Users,
  UserCheck, // Novo ícone para Gerenciamento de Usuários
} from "lucide-vue-next";

import { useState } from "#imports";

const collapsed = useState("sidebar-collapsed");

// Estado reativo para nome e role
const currentUserName = ref("user_name");
const currentUserRole = ref("viewer"); // Padrão seguro até carregar

function handleLogout() {
  console.log("Logout clicado");
  // Limpa tudo ao sair
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_role");

  // Limpa o Cookie também (Importante!)
  const tokenCookie = useCookie("auth_token");
  tokenCookie.value = null;

  navigateTo("/login");
}

// --------------------------------------------------------
// LÓGICA DE SIMULAÇÃO DE PERMISSÃO
// --------------------------------------------------------

// Verifica permissão com base no role carregado
const canManageUsers = computed(() => {
  return currentUserRole.value !== "viewer";
});

// Ao montar o componente (no cliente), recupera os dados do localStorage
onMounted(() => {
  const storedName = localStorage.getItem("user_name");
  const storedRole = localStorage.getItem("user_role");

  if (storedName) {
    currentUserName.value = storedName;
  }

  if (storedRole) {
    currentUserRole.value = storedRole;
  }
});
</script>
