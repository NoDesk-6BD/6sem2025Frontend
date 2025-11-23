<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
      <h1 class="text-2xl font-semibold text-center mb-6">Login</h1>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="block text-sm font-medium mb-1">Usuário</label>
          <input
            v-model="username"
            type="text"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Digite seu usuário"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Senha</label>
          <input
            v-model="password"
            type="password"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
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
definePageMeta({
  layout: "auth",
});

const username = ref("");
const password = ref("");

function handleLogin() {
  console.log("Realizando login:", username.value, password.value);
}
</script>
