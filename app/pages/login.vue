<!-- eslint-disable vue/html-self-closing -->
<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-t from-gray-300 to-blue-300"
  >
    <div class="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
      <h1 class="text-2xl font-semibold text-center mb-6 text-blue-600">
        Login
      </h1>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="block text-sm font-medium mb-1 text-blue-600"
            >Email</label
          >
          <input
            v-model="email"
            type="text"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-blue-600"
            placeholder="Digite seu email"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-blue-600"
            >Senha</label
          >
          <input
            v-model="password"
            type="password"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-blue-600"
            placeholder="Digite sua senha"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from "#app";
const config = useRuntimeConfig();

definePageMeta({
  layout: "auth",
});

const email = ref("");
const password = ref("");

function handleLogin() {
  console.log("Realizando login:", email.value, password.value);
  Login(email.value, password.value);
}

async function Login(email?: string, password?: string) {
  try {
    const response = await $fetch(`${config.public.apiBase}/auth/login`, {
      method: "POST",
      body: { email: email, password: password },
    });
    if (response) {
      localStorage.setItem("auth_token", response.access_token);
      navigateTo("/dashboard");
    } else {
      console.log("Falha no login: Credenciais inválidas");
    }
  } catch (err) {
    console.error("Erro ao realizar login:", err);
  }
}
</script>
