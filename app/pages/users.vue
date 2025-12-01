<template>
  <!-- app/pages/users.vue -->
  <div class="flex flex-col p-6 main-content">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2"
    >
      <h1 class="text-2xl font-bold">Usuários do sistema</h1>
    </div>

    <UCard
      class="w-full mb-6 relative z-20"
      :ui="{ base: 'overflow-visible', body: { base: 'overflow-visible p-4' } }"
      style="overflow: visible"
    >
      <template #header>
        <h2 class="text-lg font-medium text-gray-700 dark:text-gray-200">
          Pesquisar Usuário
        </h2>
      </template>

      <div class="relative">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Digite parte do nome para buscar..."
          class="w-full mb-2"
          :loading="loadingUsers"
          autocomplete="off"
        />

        <div
          v-if="searchQuery && filteredUsers.length > 0"
          class="absolute top-full left-0 z-30 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-md shadow-2xl max-h-60 overflow-y-auto"
        >
          <ul>
            <li
              v-for="user in filteredUsers"
              :key="user.id"
              class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors duration-150"
              @click="selectUserToEdit(user)"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium text-gray-900 dark:text-gray-100">
                    {{ user.full_name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ user.email }} • {{ formatCpf(user.cpf) }}
                  </p>
                </div>
                <UBadge
                  :color="user.role === 'admin' ? 'red' : 'primary'"
                  variant="subtle"
                  size="xs"
                >
                  {{ user.role }}
                </UBadge>
              </div>
            </li>
          </ul>
        </div>

        <div
          v-else-if="searchQuery && filteredUsers.length === 0"
          class="absolute z-30 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-4 mt-1 text-center text-gray-500"
        >
          Nenhum usuário encontrado com "{{ searchQuery }}"
        </div>
      </div>
    </UCard>

    <UCard class="w-full mb-6 relative z-10">
      <form class="space-y-6" @submit.prevent="onSubmit">
        <div
          class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700 mb-4"
        >
          <h2 class="text-lg font-medium text-gray-700 dark:text-gray-200">
            {{ isEditing ? "Editando Usuário" : "Novo Cadastro" }}
          </h2>
          <UButton
            v-if="isEditing"
            icon="i-lucide-plus"
            size="xs"
            color="gray"
            variant="ghost"
            label="Voltar para Novo Cadastro"
            @click="resetForm"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField name="full_name" :error="errors.full_name">
            <template #label>
              <div
                class="flex items-center gap-1.5 mb-1 text-gray-700 dark:text-gray-200 font-medium"
              >
                <UIcon name="i-lucide-user" class="w-4 h-4" />
                <span>Nome Completo:</span>
                <span class="text-red-500">*</span>
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

          <UFormField name="email" :error="errors.email">
            <template #label>
              <div
                class="flex items-center gap-1.5 mb-1 text-gray-700 dark:text-gray-200 font-medium"
              >
                <UIcon name="i-lucide-mail" class="w-4 h-4" />
                <span>E-mail:</span>
                <span class="text-red-500">*</span>
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

          <UFormField name="cpf" :error="errors.cpf">
            <template #label>
              <div
                class="flex items-center gap-1.5 mb-1 text-gray-700 dark:text-gray-200 font-medium"
              >
                <UIcon name="i-lucide-file-badge" class="w-4 h-4" />
                <span>CPF:</span>
                <span class="text-red-500">*</span>
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

          <UFormField name="phone" :error="errors.phone">
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

          <UFormField name="role" :error="errors.role">
            <template #label>
              <div
                class="flex items-center gap-1.5 mb-1 text-gray-700 dark:text-gray-200 font-medium"
              >
                <UIcon name="i-lucide-shield" class="w-4 h-4" />
                <span>Perfil de Acesso:</span>
                <span class="text-red-500">*</span>
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

          <div class="flex items-center pt-8 gap-20">
            <UCheckbox
              v-model="form.vip"
              name="vip"
              label="Usuário VIP"
              help="Habilita acesso prioritário"
            />

            <UCheckbox
              v-model="form.is_inactive"
              name="is_inactive"
              label="Desativar Conta"
              help="Bloqueia o acesso do usuário ao sistema"
              :disabled="!isEditing"
              :ui="{
                label: isEditing ? 'text-red-600 font-bold' : 'text-gray-400',
              }"
            />
          </div>

          <UFormField name="password" :error="errors.password">
            <template #label>
              <div
                class="flex items-center gap-1.5 mb-1 text-gray-700 dark:text-gray-200 font-medium"
              >
                <UIcon name="i-lucide-lock" class="w-4 h-4" />
                <span>Senha:</span>
                <span class="text-red-500">*</span>
              </div>
            </template>
            <UInput
              v-model="form.password"
              type="password"
              :placeholder="
                isEditing ? 'Mínimo 8 caracteres' : 'Mínimo 8 caracteres'
              "
              class="w-full"
              @input="errors.password = undefined"
            />
          </UFormField>

          <UFormField name="password_confirm" :error="errors.password_confirm">
            <template #label>
              <div
                class="flex items-center gap-1.5 mb-1 text-gray-700 dark:text-gray-200 font-medium"
              >
                <UIcon name="i-lucide-lock-keyhole" class="w-4 h-4" />
                <span>Confirmar Senha:</span>
                <span class="text-red-500">*</span>
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

        <!-- BOTÕES DE AÇÃO -->
        <div
          class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700"
        >
          <!-- BOTÃO DELETAR (somente edição) -->
          <UButton
            v-if="isEditing"
            type="button"
            label="Excluir"
            icon="i-lucide-trash-2"
            :disabled="!isEditing"
            class="bg-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 hover:text-white active:bg-red-700 transition-colors duration-200"
            variant="solid"
            @click="handleDeleteClick"
          />

          <!-- BOTÃO CANCELAR RESET -->
          <UButton
            type="button"
            label="Cancelar"
            variant="ghost"
            color="gray"
            class="bg-gray-200 text-gray-700 hover:bg-yellow-100 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-yello-900/30 dark:hover:text-gray-400 transition-colors duration-200"
            @click="resetForm"
          />

          <!-- BOTÃO SALVAR/CADASTRAR -->
          <UButton
            type="submit"
            :label="isEditing ? 'Atualizar Usuário' : 'Salvar Usuário'"
            color="primary"
            :loading="isLoading"
            icon="i-lucide-save"
          />
        </div>
      </form>
    </UCard>

    <!-- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-800"
      >
        <div
          class="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800"
        >
          <UIcon
            name="i-lucide-alert-triangle"
            class="w-7 h-7 text-red-600 dark:text-red-500"
          />
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            Atenção!
          </h3>
        </div>

        <div class="px-6 py-6">
          <p class="text-gray-700 dark:text-gray-300 text-base">
            Tem certeza que deseja deletar a conta de
            <strong class="text-black dark:text-white text-lg">{{
              form.full_name
            }}</strong
            >?
            <br >
            <br >
            <span
              class="text-red-600 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded"
            >
              Esta ação não poderá ser desfeita!
            </span>
          </p>
        </div>

        <div
          class="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50"
        >
          <UButton
            label="Não"
            color="gray"
            variant="ghost"
            @click="showDeleteModal = false"
          />
          <UButton
            label="Sim"
            color="red"
            variant="solid"
            icon="i-lucide-trash-2"
            :loading="isLoading"
            @click="deleteUser"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useRuntimeConfig, useToast } from "#imports";
//import DeleteUserModal from "~/components/DeleteUserModal.vue";

const config = useRuntimeConfig();
const toast = useToast();
const isLoading = ref(false);
const showDeleteModal = ref(false);

// --- TIPAGEM ---
interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string | null;
  cpf: string;
  role: string;
  vip: boolean;
  active: boolean;
  created_at?: string;
}

// Interface para erro da API
interface ApiError {
  data?: {
    detail?: string | { msg: string }[];
  };
  message?: string;
}

// --- ESTADO DE PESQUISA ---
const searchQuery = ref("");
const usersList = ref<User[]>([]);
const loadingUsers = ref(false);
const isEditing = ref(false); // Controla se estamos em modo edição
const editingId = ref<number | null>(null); // Guarda o ID do usuário sendo editado

// --- COMPUTED: FILTRAR USUÁRIOS ---
const filteredUsers = computed(() => {
  if (!searchQuery.value) return [];
  const term = searchQuery.value.toUpperCase();
  return usersList.value.filter((u) =>
    u.full_name.toUpperCase().includes(term),
  );
});

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
  is_inactive: false,
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

// --- API: BUSCAR USUÁRIOS ---
async function fetchUsers() {
  loadingUsers.value = true;
  try {
    const data = await $fetch<User[]>(`${config.public.apiBase}/users/`);
    usersList.value = data || [];
  } catch (err) {
    console.error("Erro ao buscar usuários para pesquisa", err);
  } finally {
    loadingUsers.value = false;
  }
}

// ----------------------------------------------------
// VERIFICAÇÃO DE STATUS (Botão Excluir)
// ----------------------------------------------------
async function handleDeleteClick() {
  console.log("Clicou em Excluir");
  if (!isEditing.value || !editingId.value) return;

  isLoading.value = true;

  try {
    const userCheck = await $fetch<User>(
      `${config.public.apiBase}/users/${editingId.value}`,
    );
    console.log("Status do usuário:", userCheck.active);
    // Se Ativo (true) -> BLOQUEIA
    if (userCheck.active === true) {
      toast.add({
        title: "Exclusão Bloqueada",
        description:
          "Esta conta ainda está ativa. Edite, salve como 'Desativar Conta' e tente novamente.",
        color: "yellow",
        icon: "i-lucide-alert-triangle",
        timeout: 8000,
      });
      return; // Retorna sem abrir modal
    }

    // Se chegou aqui, active = false -> abre modal
    console.log("Usuário inativo, abrindo modal...");
    showDeleteModal.value = true;
  } catch (err) {
    console.error("Erro na verificação", err);
    toast.add({
      title: "Erro",
      description: "Falha ao verificar status.",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
}

// ----------------------------------------------------
// DELETAR (Chamado pelo Modal)
// ----------------------------------------------------
async function deleteUser() {
  if (!editingId.value) return;

  isLoading.value = true;
  try {
    await $fetch(`${config.public.apiBase}/users/${editingId.value}`, {
      method: "DELETE",
    });

    toast.add({
      title: "Conta Deletada",
      description: "O registro foi removido definitivamente do banco de dados.",
      color: "green",
      icon: "i-lucide-trash-2",
    });

    showDeleteModal.value = false;
    resetForm();
    fetchUsers();
  } catch (err: unknown) {
    const error = err as ApiError;
    console.error("Erro ao excluir:", error);
    let msg = "Não foi possível excluir a conta.";
    if (error.data?.detail) {
      msg = Array.isArray(error.data.detail)
        ? error.data.detail[0].msg
        : (error.data.detail as string);
    }
    toast.add({ title: "Erro", description: msg, color: "red" });
  } finally {
    isLoading.value = false;
  }
}

// --- SELECIONAR USUÁRIO DA LISTA (PREENCHER FORM) ---
function selectUserToEdit(user: User) {
  isEditing.value = true;
  editingId.value = user.id;

  // Preenche o formulário
  form.full_name = user.full_name;
  form.email = user.email;
  // Formata visualmente o CPF e Telefone se necessário
  handleCpfInput(user.cpf);
  if (user.phone) handlePhoneInput(user.phone);

  form.role = user.role;
  form.vip = user.vip;

  // TRATATIVA DO STATUS:
  // Se user.active == true, então is_inactive = false (Não marcar checkbox)
  // Se user.active == false, então is_inactive = true (Marcar checkbox)
  form.is_inactive = !user.active;

  // Limpa campos de senha (não vêm da API por segurança)
  form.password = "";
  form.password_confirm = "";

  // Limpa a busca para fechar a lista
  searchQuery.value = "";
  showDeleteModal.value = false;

  toast.add({
    title: "Modo de Edição",
    description: `Carregados dados de ${user.full_name}`,
    color: "blue",
    icon: "i-lucide-pencil",
  });
}

// --- FUNÇÃO DE LIMPEZA ---
function resetForm() {
  form.email = "";
  form.password = "";
  form.password_confirm = "";
  form.full_name = "";
  form.phone = "";
  form.cpf = "";
  form.vip = false;
  form.is_inactive = false;
  form.role = undefined;

  // Reseta estados de edição
  isEditing.value = false;
  editingId.value = null;
  searchQuery.value = "";
  showDeleteModal.value = false;

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

// Helper apenas para visualização na lista (sem alterar o model)
function formatCpf(value: string) {
  if (!value) return "";
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
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

  // 3. CPF
  const cpfClean = form.cpf.replace(/\D/g, "");
  if (!cpfClean || cpfClean.length !== 11) {
    // Texto solicitado + aviso de tamanho
    errors.cpf = "Informe somente números (11 dígitos necessários)";
    isValid = false;
  }

  // 4. Telefone (AGORA OPCIONAL)
  // Valida apenas se o usuário digitou algo
  const phoneClean = form.phone.replace(/\D/g, "");
  if (phoneClean.length > 0 && phoneClean.length < 10) {
    errors.phone = "Se informado, use DDD + Número";
    isValid = false;
  }

  // 5. Senha
  if (!isEditing.value) {
    // Novo Cadastro: Senha obrigatória
    if (!form.password || form.password.length < 8) {
      errors.password = "Senha obrigatória (min 8 chars).";
      isValid = false;
    }
    if (form.password !== form.password_confirm) {
      errors.password_confirm = "As senhas não conferem.";
      isValid = false;
    }
  } else {
    // Edição: Senha opcional (valida apenas se preenchida)
    if (form.password.length > 0) {
      if (form.password.length < 8) {
        errors.password = "Mínimo 8 caracteres.";
        isValid = false;
      }
      if (form.password !== form.password_confirm) {
        errors.password_confirm = "As senhas não conferem.";
        isValid = false;
      }
    }
  }

  // 6. Role ID
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
    // Correção lint: Tipagem do payload ao invés de 'any'
    const payload: Record<string, unknown> = {
      full_name: form.full_name,
      email: form.email,
      vip: form.vip,
      cpf: form.cpf.replace(/\D/g, ""),
      phone: form.phone.replace(/\D/g, ""),
      role: form.role,
    };
    if (form.password) {
      payload.password = form.password;
    }

    let url = `${config.public.apiBase}/users/`;
    let method: "POST" | "PUT" = "POST";
    let successMsg = "Usuário cadastrado.";

    if (isEditing.value && editingId.value) {
      url = `${config.public.apiBase}/users/${editingId.value}`;
      method = "PUT";
      successMsg = "Dados atualizados.";
      payload.active = !form.is_inactive;
    }

    await $fetch(url, {
      method: method,
      body: payload,
    });

    toast.add({ title: "Sucesso!", description: successMsg, color: "green" });

    resetForm();
    fetchUsers();
  } catch (err: unknown) {
    // Correção lint: Uso de ApiError ao invés de any
    const error = err as ApiError;
    console.error("Erro API:", error);
    let msg = "Erro desconhecido";
    if (error.data?.detail) {
      msg = Array.isArray(error.data.detail)
        ? error.data.detail[0].msg
        : (error.data.detail as string);
    } else if (error.message) {
      msg = error.message;
    }

    const lowerMsg = msg.toLowerCase();
    if (lowerMsg.includes("cpf")) {
      const ptMsg = "Este CPF já está cadastrado.";
      errors.cpf = ptMsg;
      msg = ptMsg;
    }
    if (lowerMsg.includes("email")) {
      const ptMsg = "Este e-mail já está em uso.";
      errors.email = ptMsg;
      msg = ptMsg;
    }
    toast.add({ title: "Erro ao salvar", description: msg, color: "red" });
  } finally {
    isLoading.value = false;
  }
}

// Carregar lista ao entrar na tela
const { checkUserAcceptance } = useTerms();

onMounted(async () => {
  const UserAcceptance = await checkUserAcceptance();
  if (UserAcceptance) {
    fetchUsers();
  } else {
    navigateTo("/login");
  }
});
</script>
