// app/pages/users.vue

<template>
  <!--
    Container principal da página
    Usando o mesmo padding e layout do index.vue e customers.vue
  -->
  <div class="flex flex-col p-6 main-content">
    <!-- Cabeçalho: Título e Botão de Ação -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2"
    >
      <h1 class="text-2xl font-bold">Gerenciamento de Usuários</h1>
      <UButton icon="i-heroicons-plus" size="md" @click="openSlideover(null)">
        Cadastrar Usuário
      </UButton>
    </div>

    <!-- Barra de Ferramentas da Tabela: Filtro -->
    <div class="flex items-center justify-between mb-4">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass-20-solid"
        placeholder="Buscar por nome..."
        class="w-full sm:w-80"
      />
    </div>

    <!-- Tabela para Listar os Usuários (READ) -->
    <UCard :ui="{ body: { padding: 'p-0' } }">
      <UTable
        :rows="filteredUsers"
        :columns="columns"
        :loading="loadingTable || loadingRoles"
      >
        <!-- Coluna de Ações Customizada -->
        <template #actions-data="{ row }">
          <UDropdown :items="getItemsActions(row)">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
        </template>
        <!-- Coluna VIP Customizada -->
        <template #vip-data="{ row }">
          <UBadge
            :label="row.vip ? 'VIP' : 'Normal'"
            :color="row.vip ? 'amber' : 'gray'"
            variant="subtle"
          />
        </template>
        <!-- Coluna Regra de Acesso Customizada -->
        <template #role_id-data="{ row }">
          <UBadge
            :label="getRoleName(row.role_id)"
            :color="getRoleColor(row.role_id)"
            variant="subtle"
          />
        </template>
        <!-- Coluna Status Customizada -->
        <template #is_active-data="{ row }">
          <UBadge :color="row.is_active ? 'green' : 'red'" variant="soft">
            {{ row.is_active ? "Ativo" : "Inativo" }}
          </UBadge>
        </template>
      </UTable>

      <!-- Paginação (Simulação - A paginação real viria do backend) -->
      <template #footer>
        <div class="flex justify-end p-4">
          <UPagination
            v-model="page"
            :page-count="pageCount"
            :total="totalUsers"
          />
        </div>
      </template>
    </UCard>

    <!-- Modal de Confirmação de Exclusão (Soft Delete) -->
    <UModal v-model="isConfirmModalOpen">
      <UCard>
        <div class="flex flex-col gap-4">
          <h2 class="text-xl font-semibold">Confirmar Desativação</h2>
          <p>
            Tem certeza de que deseja desativar o usuário
            <strong>{{ userToDelete?.full_name }}</strong
            >? Esta ação removerá a chave de acesso e o tornará **inativo**.
          </p>
          <div class="flex justify-end gap-2">
            <UButton
              color="gray"
              variant="ghost"
              @click="isConfirmModalOpen = false"
            >
              Cancelar
            </UButton>
            <UButton
              color="red"
              :loading="loadingDelete"
              @click="confirmDelete"
            >
              Desativar Usuário
            </UButton>
          </div>
        </div>
      </UCard>
    </UModal>

    <!-- Slideover para Cadastro/Edição (CREATE/UPDATE) -->
    <USlideover v-model="isSlideoverOpen">
      <UCard
        class="flex flex-col flex-1"
        :ui="{
          body: { base: 'flex-1' },
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              {{ isEditing ? "Editar Usuário" : "Cadastrar Usuário" }}
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isSlideoverOpen = false"
            />
          </div>
        </template>

        <!-- Formulário de Usuário -->
        <UForm
          :schema="UserSchema"
          :state="state"
          class="p-4 space-y-4"
          @submit="onSubmit"
        >
          <!-- Campos do Formulário -->
          <UFormGroup label="Nome Completo" name="full_name">
            <UInput v-model="state.full_name" />
          </UFormGroup>

          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" type="email" />
          </UFormGroup>

          <!-- CAMPO: Regra de Acesso -->
          <UFormGroup label="Regra de Acesso" name="role_id">
            <USelectMenu
              v-model="state.role_id"
              :options="roleOptions"
              :loading="loadingRoles"
              placeholder="Selecione a regra"
              value-attribute="value"
              option-attribute="label"
              searchable
            />
          </UFormGroup>

          <UFormGroup label="Telefone" name="phone">
            <UInput
              v-model="state.phone"
              v-maska
              data-maska="(##) #####-####"
              placeholder="(99) 99999-9999"
            />
          </UFormGroup>

          <UFormGroup label="CPF" name="cpf">
            <UInput
              v-model="state.cpf"
              v-maska
              data-maska="###.###.###-##"
              placeholder="999.999.999-99"
            />
          </UFormGroup>

          <UFormGroup label="VIP" name="vip">
            <UToggle v-model="state.vip" on-icon="i-heroicons-check-20-solid" />
          </UFormGroup>

          <h4 class="text-lg font-semibold pt-4 border-t">
            {{ isEditing ? "Alterar Senha" : "Senha de Acesso" }}
          </h4>
          <p v-if="isEditing" class="text-sm text-gray-500">
            Deixe os campos em branco para manter a senha atual.
          </p>

          <UFormGroup label="Senha" name="password">
            <UInput v-model="state.password" type="password" />
          </UFormGroup>

          <UFormGroup label="Confirme a Senha" name="passwordConfirm">
            <UInput v-model="state.passwordConfirm" type="password" />
          </UFormGroup>

          <UButton
            type="submit"
            block
            :loading="loadingSubmit"
            :disabled="loadingRoles"
          >
            {{ isEditing ? "Atualizar Usuário" : "Cadastrar Usuário" }}
          </UButton>
        </UForm>

        <template #footer>
          <!-- Nada no rodapé por enquanto -->
        </template>
      </UCard>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { vMaska } from "maska";

// Configurações e Toasts
const config = useRuntimeConfig();
const toast = useToast();

// =========================================================
// 1. TIPAGENS E ESQUEMA ZOD
// =========================================================

/** Interface para o objeto Role retornado pelo novo endpoint */
interface Role {
  id: number;
  name: string;
}

/** Interface simplificada para o objeto de Usuário na tabela/edição
 * NOTE: Usando is_active (conforme JSON real) em vez de active.
 */
interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  cpf: string;
  vip: boolean;
  role_id: number; // Novo campo
  is_active: boolean; // Novo campo (nome vindo do backend)
  // Campos de data podem ser opcionais para o frontend
  created_at?: string;
  updated_at?: string;
}

// Esquema Zod para validação do formulário
const passwordSchema = z.string().optional();

const UserSchema = z
  .object({
    email: z.string().email("Formato de email inválido"),
    password: passwordSchema,
    passwordConfirm: passwordSchema,
    full_name: z.string().min(1, "Nome completo é obrigatório"),
    phone: z.string().min(1, "Telefone é obrigatório"),
    cpf: z.string().min(1, "CPF é obrigatório"),
    vip: z.boolean(),
    // Validação do role_id (Deve ser um número e maior ou igual a 1)
    role_id: z
      .number({ invalid_type_error: "A regra de acesso é obrigatória" })
      .min(1, "A regra de acesso é obrigatória"),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    // Regra para senhas: devem ser iguais se forem preenchidas
    if (password && passwordConfirm && password !== passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As senhas não coincidem",
        path: ["passwordConfirm"],
      });
    }
    // Regra para cadastro: senha é obrigatória se não for edição
    if (!isEditing.value && !password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A senha é obrigatória no cadastro",
        path: ["password"],
      });
    }
  });

type UserSchema = z.output<typeof UserSchema>;

// =========================================================
// 2. ESTADO DO COMPONENTE
// =========================================================

// Tabela (Read)
const users = ref<UserResponse[]>([]);
const search = ref(""); // Estado para o campo de busca
const loadingTable = ref(false);
const page = ref(1);
const pageCount = 10;
const totalUsers = ref(0);

// Slideover (Create/Update)
const isSlideoverOpen = ref(false);
const isEditing = ref(false);
const selectedUserId = ref<number | null>(null);
const loadingSubmit = ref(false);
const loadingUser = ref(false);

// Modal de Exclusão (Delete)
const isConfirmModalOpen = ref(false);
const userToDelete = ref<UserResponse | null>(null);
const loadingDelete = ref(false);

// Estado das Roles
const roles = ref<Role[]>([]);
const loadingRoles = ref(false);

// Estado do Formulário
const initialState = {
  email: "",
  password: "",
  passwordConfirm: "",
  full_name: "",
  phone: "",
  cpf: "",
  vip: false,
  role_id: null as number | null, // NOVO CAMPO
};

const state = reactive(Object.assign({}, initialState));

// =========================================================
// 3. LÓGICA DE DADOS (Fetch e Mapeamento)
// =========================================================

// Mapeamento de Roles para o USelectMenu
const roleOptions = computed(() =>
  roles.value.map((role) => ({
    label: role.name.charAt(0).toUpperCase() + role.name.slice(1), // Capitaliza o nome
    value: role.id,
  })),
);

// Busca a lista de Regras de Acesso (Roles) - AGORA REAL
async function fetchRoles() {
  loadingRoles.value = true;
  try {
    const apiEndpoint = `${config.public.apiBase}/users/roles`;
    const response = await $fetch<Role[]>(apiEndpoint);
    roles.value = response;
  } catch (error) {
    console.error("Erro ao buscar as regras de acesso:", error);
    toast.add({
      title: "Erro",
      description: "Não foi possível carregar as regras de acesso.",
      color: "red",
    });
  } finally {
    loadingRoles.value = false;
  }
}

// Busca a lista de usuários para a tabela - AGORA REAL
async function fetchUsers() {
  loadingTable.value = true;
  try {
    const apiEndpoint = `${config.public.apiBase}/users/`;
    // Chamada real ao backend
    const data = await $fetch<UserResponse[]>(apiEndpoint);

    // Filtra e ordena a lista de usuários
    users.value = data.sort((a, b) => a.full_name.localeCompare(b.full_name));
    totalUsers.value = data.length;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    toast.add({
      title: "Erro",
      description: "Não foi possível carregar a lista de usuários.",
      color: "red",
    });
  } finally {
    loadingTable.value = false;
  }
}

// Chamadas de inicialização
onMounted(() => {
  fetchRoles();
  fetchUsers();
});

// =========================================================
// 4. TABELA E AÇÕES
// =========================================================

const columns = [
  {
    key: "id",
    label: "#",
  },
  {
    key: "full_name",
    label: "Nome",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
  },
  // Coluna atualizada para exibir o nome da Regra de Acesso
  {
    key: "role_id",
    label: "Regra de Acesso",
  },
  {
    key: "vip",
    label: "VIP",
  },
  {
    key: "is_active", // Coluna alterada
    label: "Status",
  },
  {
    key: "actions",
    label: "Ações",
  },
];

// Lógica para obter o nome da regra de acesso pelo ID
const getRoleName = (roleId: number): string => {
  return roles.value.find((r) => r.id === roleId)?.name || "Desconhecida";
};

// Lógica para cor do Badge
const getRoleColor = (roleId: number): string => {
  if (roleId === 1) return "red"; // admin
  if (roleId === 2) return "blue"; // agent
  if (roleId === 3) return "green"; // viewer
  return "gray";
};

// Lista de usuários filtrada e ordenada (para a tabela)
const filteredUsers = computed(() => {
  if (!search.value) {
    // Já está ordenado em fetchUsers
    return users.value;
  }
  // Se houver busca, filtra e mantém a ordenação
  return users.value.filter((user) => {
    // Busca case-insensitive
    return user.full_name.toLowerCase().includes(search.value.toLowerCase());
  });
});

// Ações do Dropdown
const getItemsActions = (row: UserResponse) => [
  [
    {
      label: "Editar",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => openSlideover(row.id),
    },
    {
      label: "Desativar (Delete)",
      icon: "i-heroicons-trash-20-solid",
      click: () => openConfirmModal(row),
    },
  ],
];

// Abre o modal de confirmação de exclusão
function openConfirmModal(user: UserResponse) {
  userToDelete.value = user;
  isConfirmModalOpen.value = true;
}

// Confirma a exclusão (DELETE)
async function confirmDelete() {
  if (!userToDelete.value) return;

  loadingDelete.value = true;
  try {
    const apiEndpoint = `${config.public.apiBase}/users/${userToDelete.value.id}/`;
    await $fetch(apiEndpoint, {
      method: "DELETE",
    });

    toast.add({
      title: `Usuário ${userToDelete.value.full_name} desativado com sucesso!`,
      description: "O usuário foi marcado como inativo (soft-delete).",
      color: "green",
    });

    // Fecha o modal e atualiza a tabela
    isConfirmModalOpen.value = false;
    userToDelete.value = null;
    fetchUsers(); // Recarrega a tabela
  } catch (unknownError) {
    console.error("Erro ao deletar usuário:", unknownError);
    const errorData = (unknownError as { data?: { detail?: string } })?.data;
    toast.add({
      title: "Erro",
      description: errorData?.detail || "Não foi possível desativar o usuário.",
      color: "red",
    });
  } finally {
    loadingDelete.value = false;
  }
}

// =========================================================
// 5. SLIDEOVER E FORMULÁRIO (Create/Update)
// =========================================================

// Abre o slideover para edição ou cadastro
async function openSlideover(userId: number | null) {
  // Limpa o estado antes de tudo
  Object.assign(state, initialState);

  isSlideoverOpen.value = true;
  isEditing.value = userId !== null;
  selectedUserId.value = userId;

  if (userId) {
    loadingUser.value = true;
    try {
      // Busca dados de um usuário específico
      const apiEndpoint = `${config.public.apiBase}/users/${userId}/`;
      const user = await $fetch<UserResponse>(apiEndpoint);

      // Preenche o estado com os dados do usuário (usando .id)
      Object.assign(state, {
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        cpf: user.cpf,
        vip: user.vip,
        role_id: user.role_id,
        password: "",
        passwordConfirm: "",
      });
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      toast.add({
        title: "Erro",
        description:
          "Não foi possível carregar os dados do usuário para edição.",
        color: "red",
      });
      isSlideoverOpen.value = false;
    } finally {
      loadingUser.value = false;
    }
  }
}

// Submissão do Formulário (CREATE ou UPDATE)
async function onSubmit(event: FormSubmitEvent<UserSchema>) {
  loadingSubmit.value = true;

  try {
    const apiEndpoint = `${config.public.apiBase}/users/`;
    const method = isEditing.value ? "PUT" : "POST";
    const url = isEditing.value
      ? `${apiEndpoint}${selectedUserId.value}/`
      : apiEndpoint;

    // Prepara o payload
    const payload = { ...event.data };

    // Remove campos de senha se estiver editando e a senha não foi alterada
    if (isEditing.value && !payload.password) {
      delete payload.password;
      delete payload.passwordConfirm;
    }
    // Remove o campo de confirmação de senha do payload final
    delete payload.passwordConfirm;

    // Remove máscaras antes de enviar
    payload.cpf = payload.cpf?.replace(/\D/g, "");
    payload.phone = payload.phone?.replace(/\D/g, "");

    // Chamada da API
    await $fetch(url, {
      method: method,
      body: payload,
    });

    toast.add({
      title: `Usuário ${isEditing.value ? "atualizado" : "cadastrado"} com sucesso!`,
      color: "green",
    });

    // Fecha o painel, recarrega a tabela e limpa o estado
    isSlideoverOpen.value = false;
    fetchUsers(); // Atualiza a tabela
    Object.assign(state, initialState); // Limpa o formulário
  } catch (unknownError) {
    console.error("Erro no cadastro/edição de usuário:", unknownError);
    const errorData = (unknownError as { data?: { detail?: string } })?.data;
    toast.add({
      title: "Erro",
      description:
        errorData?.detail ||
        `Não foi possível ${isEditing.value ? "atualizar" : "cadastrar"} o usuário.`,
      color: "red",
    });
  } finally {
    loadingSubmit.value = false;
  }
}
</script>

<style scoped>
/* Estilos específicos, se necessário */
</style>
