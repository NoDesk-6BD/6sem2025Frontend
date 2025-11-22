<template>
  <div class="flex flex-col p-6 main-content">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2"
    >
      <h1 class="text-2xl font-bold">Usuários do sistema</h1>
    </div>

    <!-- <UCard class="max-w-3xl mx-auto w-full"> Removido -->
    <UCard class="w-full">
      <form class="space-y-6" @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- NOME -->
          <UFormField name="full_name" required :error="errors.full_name">
            <template #label>
              <div
                class="flex items-center gap-1.5 mb-1 text-gray-700 dark:text-gray-200 font-medium"
              >
                <UIcon name="i-lucide-user" class="w-4 h-4" />
                <span>Nome Completo:</span>
              </div>
            </template>
            <UInput
              :model-value="form.full_name"
              placeholder="DIGITE O NOME COMPLETO"
              class="w-full"
              @update:model-value="handleNameInput"
              @input="errors.full_name = undefined"
            />
          </UFormField>

          <!-- EMAIL -->
          <UFormField name="email" required :error="errors.email">
            <template #label>
              <div
                class="flex items-center gap-1.5 mb-1 text-gray-700 dark:text-gray-200 font-medium"
              >
                <UIcon name="i-lucide-mail" class="w-4 h-4" />
                <span>E-mail:</span>
              </div>
            </template>
            <UInput
              :model-value="form.email"
              type="email"
              placeholder="user@example.com"
              class="w-full"
              @update:model-value="handleEmailInput"
              @input="errors.email = undefined"
            />
          </UFormField>

          <!-- CPF -->
          <UFormField name="cpf" required :error="errors.cpf">
            <template #label>
              <div
                class="flex items-center gap-1.5 mb-1 text-gray-700 dark:text-gray-200 font-medium"
              >
                <UIcon name="i-lucide-file-badge" class="w-4 h-4" />
                <span>CPF:</span>
              </div>
            </template>
            <UInput
              :model-value="form.cpf"
              placeholder="000.000.000-00"
              maxlength="14"
              class="w-full"
              @update:model-value="handleCpfInput"
              @input="errors.cpf = undefined"
            />
          </UFormField>

          <!-- TELEFONE -->
          <UFormField name="phone" required :error="errors.phone">
            <template #label>
              <div
                class="flex items-center gap-1.5 mb-1 text-gray-700 dark:text-gray-200 font-medium"
              >
                <UIcon name="i-lucide-phone" class="w-4 h-4" />
                <span>Telefone:</span>
              </div>
            </template>
            <UInput
              :model-value="form.phone"
              placeholder="(00) 00000-0000"
              maxlength="15"
              class="w-full"
              @update:model-value="handlePhoneInput"
              @input="errors.phone = undefined"
            />
          </UFormField>

          <!-- PERFIL DE ACESSO -->
          <UFormField name="role" required :error="errors.role">
            <template #label>
              <div
                class="flex items-center gap-1.5 mb-1 text-gray-700 dark:text-gray-200 font-medium"
              >
                <UIcon name="i-lucide-shield" class="w-4 h-4" />
                <span>Perfil de Acesso:</span>
              </div>
            </template>
            <USelect
              v-model="form.role"
              :items="roles"
              option-attribute="label"
              value-attribute="value"
              placeholder="Selecione o perfil"
              class="w-full"
              @change="errors.role = undefined"
            />
          </UFormField>

          <!-- VIP -->
          <div class="flex items-center pt-8">
            <UCheckbox
              v-model="form.vip"
              name="vip"
              label="Usuário VIP"
              help="Habilita acesso prioritário"
            />
          </div>

          <!-- SENHA -->
          <UFormField name="password" required :error="errors.password">
            <template #label>
              <div
                class="flex items-center gap-1.5 mb-1 text-gray-700 dark:text-gray-200 font-medium"
              >
                <UIcon name="i-lucide-lock" class="w-4 h-4" />
                <span>Senha:</span>
              </div>
            </template>
            <UInput
              v-model="form.password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              class="w-full"
              @input="errors.password = undefined"
            />
          </UFormField>

          <!-- CONFIRMAR SENHA -->
          <UFormField
            name="password_confirm"
            required
            :error="errors.password_confirm"
          >
            <template #label>
              <div
                class="flex items-center gap-1.5 mb-1 text-gray-700 dark:text-gray-200 font-medium"
              >
                <UIcon name="i-lucide-lock-keyhole" class="w-4 h-4" />
                <span>Confirmar Senha:</span>
              </div>
            </template>
            <UInput
              v-model="form.password_confirm"
              type="password"
              placeholder="Repita a senha"
              class="w-full"
              @input="errors.password_confirm = undefined"
            />
          </UFormField>
        </div>

        <!-- BOTÕES-->
        <div
          class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700"
        >
          <UButton
            type="button"
            label="Cancelar"
            variant="ghost"
            color="gray"
            class="bg-gray-200 text-gray-700 hover:bg-red-100 hover:text-red-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors duration-200"
            @click="resetForm"
          />

          <UButton
            type="submit"
            label="Salvar Usuário"
            color="primary"
            :loading="isLoading"
            icon="i-lucide-save"
          />
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRuntimeConfig, useToast } from "#imports"; // 'navigateTo' removido pois não era usado

const config = useRuntimeConfig();
const toast = useToast();
const isLoading = ref(false);

// Opções de Roles (Perfis)
const roles = ref([
  { label: "Administrador", value: "admin" },
  { label: "Agente", value: "agent" },
  { label: "Visualizador", value: "viewer" },
]);

// Estado do formulário
const form = reactive({
  email: "",
  password: "",
  password_confirm: "",
  full_name: "",
  phone: "",
  cpf: "",
  vip: false,
  role: undefined as string | undefined,
});

// Estado dos erros (undefined = sem erro)
const errors = reactive({
  email: undefined as string | undefined,
  password: undefined as string | undefined,
  password_confirm: undefined as string | undefined,
  full_name: undefined as string | undefined,
  phone: undefined as string | undefined,
  cpf: undefined as string | undefined,
  role: undefined as string | undefined,
});

// --- FUNÇÃO DE LIMPEZA ---
function resetForm() {
  // 1. Limpa os valores
  form.email = "";
  form.password = "";
  form.password_confirm = "";
  form.full_name = "";
  form.phone = "";
  form.cpf = "";
  form.vip = false;
  form.role = undefined;

  // 2. Limpa os erros visuais
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = undefined;
  });
}

// --- HANDLERS DE INPUT ---
function handleNameInput(value: string) {
  form.full_name = (value || "").toUpperCase();
  if (form.full_name) errors.full_name = undefined;
}

function handleEmailInput(value: string) {
  form.email = (value || "").toLowerCase();
  if (form.email) errors.email = undefined;
}

function handleCpfInput(value: string) {
  if (!value) {
    form.cpf = "";
    return;
  }
  let v = value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);

  if (v.length > 0) {
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  form.cpf = v;
  errors.cpf = undefined; // Limpa erro ao digitar
}

function handlePhoneInput(value: string) {
  if (!value) {
    form.phone = "";
    return;
  }
  let v = value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);

  if (v.length > 0) {
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
  }
  form.phone = v;
  errors.phone = undefined; // Limpa erro ao digitar
}

/* --- FUNÇÃO AUXILIAR DE VALIDAÇÃO DE CPF ---
function isValidCPF(cpf: string): boolean {
  if (typeof cpf !== 'string') return false

  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]+/g, '')

  // Verifica se tem 11 dígitos ou se são todos iguais (ex: 111.111.111-11 é inválido mas passa no cálculo)
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false

  // Validação do 1º Dígito Verificador
  const cpfArray = cpf.split('').map(el => +el)
  let rest = cpfArray.slice(0, 9).reduce((soma, el, index) => soma + el * (10 - index), 0)
  rest = (rest * 10) % 11
  if (rest === 10 || rest === 11) rest = 0
  if (rest !== cpfArray[9]) return false

  // Validação do 2º Dígito Verificador
  rest = cpfArray.slice(0, 10).reduce((soma, el, index) => soma + el * (11 - index), 0)
  rest = (rest * 10) % 11
  if (rest === 10 || rest === 11) rest = 0
  if (rest !== cpfArray[10]) return false

  return true
} */

// --- VALIDAÇÃO ---
function validateForm() {
  let isValid = true;
  Object.keys(errors).forEach(
    (key) => (errors[key as keyof typeof errors] = undefined),
  );

  // 1. Nome
  if (!form.full_name || form.full_name.length < 3) {
    errors.full_name = "O nome deve ter no mínimo 3 caracteres.";
    isValid = false;
  }

  // 2. Email (Regra pedida)
  if (!form.email || !form.email.includes("@") || !form.email.includes(".")) {
    errors.email = "Informe um e-mail válido, exemplo: usuário@dominio.com";
    isValid = false;
  }

  /* // 3. CPF (Agora com validação matemática)
  const cpfClean = form.cpf.replace(/\D/g, '')
  if (!cpfClean || cpfClean.length !== 11) {
    errors.cpf = 'Informe somente números (11 dígitos necessários)'
    isValid = false
  } else if (!isValidCPF(cpfClean)) {
    // Nova validação aqui!
    errors.cpf = 'CPF inválido (Verifique os dígitos)'
    isValid = false
  } */

  // 3. CPF
  const cpfClean = form.cpf.replace(/\D/g, "");
  if (!cpfClean || cpfClean.length !== 11) {
    // Texto solicitado + aviso de tamanho
    errors.cpf = "Informe somente números (11 dígitos necessários)";
    isValid = false;
  }

  // 4. Telefone
  const phoneClean = form.phone.replace(/\D/g, "");
  if (!phoneClean || phoneClean.length < 10) {
    errors.phone = "Informe somente números (com DDD)";
    isValid = false;
  }

  // 5. Senha, Tamanho e Confirmação Senha.
  if (!form.password || form.password.length < 8) {
    errors.password = "Digite no mínimo 8 caracteres";
    isValid = false;
  }

  if (form.password !== form.password_confirm) {
    errors.password_confirm = "As senhas não conferem";
    isValid = false;
  }

  // 7. Role ID
  if (!form.role) {
    errors.role = "Selecione um perfil de acesso";
    isValid = false;
  }

  return isValid;
}

// --- SUBMIT ---

async function onSubmit() {
  // Executa validação antes de qualquer coisa
  if (!validateForm()) {
    // Opcional: Toast genérico avisando para corrigir os campos vermelhos
    toast.add({
      title: "Atenção",
      description: "Verifique os campos em vermelho.",
      color: "red",
      icon: "i-lucide-alert-circle",
    });
    return;
  }

  isLoading.value = true;

  try {
    // 2. Prepara o payload (remove formatações)
    const payload = {
      full_name: form.full_name,
      email: form.email,
      password: form.password,
      vip: form.vip,
      cpf: form.cpf.replace(/\D/g, ""),
      phone: form.phone.replace(/\D/g, ""),
      role: form.role,
    };

    // 3. Envia para a API
    await $fetch(`${config.public.apiBase}/users/`, {
      method: "POST",
      body: payload,
    });

    toast.add({
      title: "Sucesso!",
      description: "Usuário cadastrado corretamente.",
      color: "green",
      icon: "i-lucide-check-circle",
    });

    resetForm();
  } catch (err: unknown) {
    // Tipagem segura de erro
    const error = err as ApiError;

    // CORREÇÃO: Usando a variável 'error' para garantir que ela não seja marcada como "unused"
    console.error("Erro detalhado:", error);

    let messageDetalhada = "Erro desconhecido";

    if (error.data) {
      if (Array.isArray(error.data.detail)) {
        messageDetalhada = error.data.detail
          .map((e: { loc: string[]; msg: string }) => {
            const campo = e.loc ? e.loc[e.loc.length - 1] : "";
            return campo ? `${campo}: ${e.msg}` : e.msg;
          })
          .join(" | ");
      } else if (error.data.detail && typeof error.data.detail === "string") {
        messageDetalhada = error.data.detail;
      } else if (error.data.message) {
        messageDetalhada = error.data.message;
      }
    } else if (error.message) {
      if (error.statusCode === 422) {
        messageDetalhada =
          "Dados inválidos ou já existentes (Verifique CPF/Email)";
      } else {
        messageDetalhada = error.message;
      }
    }

    toast.add({
      title: "Falha ao salvar",
      description: messageDetalhada,
      color: "red",
      icon: "i-lucide-x-circle",
      timeout: 6000,
    });
  } finally {
    isLoading.value = false;
  }
}
</script>
