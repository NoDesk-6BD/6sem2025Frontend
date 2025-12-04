<!-- eslint-disable vue/html-self-closing -->
<template>
  <!-- app/pages/login.vue -->
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-t from-gray-300 to-blue-300"
  >
    <div class="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
      <h1 class="text-2xl font-semibold text-center mb-6 text-blue-600">
        Login
      </h1>

      <!-- Mensagem de erro -->
      <div
        v-if="errorMessage"
        class="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-300 text-sm"
      >
        {{ errorMessage }}
      </div>

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
const errorMessage = ref("");

// Interface para tipar a resposta do Login
interface LoginResponse {
  user_id: number;
  name: string;
  email: string;
  role: string;
  access_token: string;
  token_type: string;
}

function handleLogin() {
  errorMessage.value = ""; // limpa erro antes de tentar
  Login(email.value, password.value);
}

async function Login(email?: string, password?: string) {
  try {
    const response = await $fetch<LoginResponse>(
      `${config.public.apiBase}/auth/login`,
      {
        method: "POST",
        body: { email, password },
      },
    );

    if (response && response.access_token) {
      // 1. Salva Token e ID
      localStorage.setItem("auth_token", response.access_token);
      localStorage.setItem("user_id", response.user_id.toString());

      // 2. Salva Nome e Role para uso na Sidebar e Permissões
      localStorage.setItem("user_name", response.name);
      localStorage.setItem("user_role", response.role);

      // 2. Salva no Cookie (para o Middleware funcionar no reload/server-side)
      // PADRONIZAÇÃO: auth_token
      const tokenCookie = useCookie("auth_token");
      tokenCookie.value = response.access_token;

      await fetchLatestTerms();
      navigateTo("/dashboard");

      return;
    }

    // Caso a API retorne 200 mas sem token
    errorMessage.value = "Credenciais inválidas. Tente novamente.";
  } catch (err) {
    console.error("Erro ao realizar login:", err);

    errorMessage.value = "Falha ao realizar login. Verifique suas credenciais.";
    console.log("Erro ao realizar login:", err);
  }
}

async function postBaseTerm() {
  const baseTerm = {
    version: "1",
    content:
      "Ao utilizar esta plataforma, você concorda que seus dados pessoais serão coletados, armazenados e processados conforme descrito neste termo. Seus dados serão utilizados exclusivamente para melhorar sua experiência na plataforma e para fins administrativos. Não compartilharemos suas informações com terceiros sem o seu consentimento explícito, exceto quando exigido por lei. Você tem o direito de acessar, corrigir ou excluir seus dados a qualquer momento, entrando em contato conosco. Ao continuar a usar a plataforma, você reconhece que leu e concorda com este termo de uso de dados.",
    type: "required",
  };

  $fetch<{ name: string; count: number }[]>(
    `${config.public.apiBase}/terms/new`,
    {
      method: "POST",
      body: baseTerm,
    },
  );
}

async function fetchLatestTerms() {
  try {
    await $fetch<{ name: string; count: number }[]>(
      `${config.public.apiBase}/terms/latest`,
      { method: "GET" },
    );
  } catch (error) {
    if (error.status === 404) {
      await postBaseTerm();
    } else {
      console.error("Erro ao buscar termos:", error);
    }
  }
}
</script>
