<template>
  <!-- app/pages/customers.vue -->
  <!-- Container principal da página, mantendo o padrão -->
  <div class="flex flex-col p-6 main-content">
    <!-- Cabeçalho: Título e Filtro de Cliente -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2"
    >
      <h1 class="text-2xl font-bold">Visão do Cliente</h1>

      <!-- Filtro de Caixa de Seleção para Clientes -->
      <div
        class="flex flex-col items-end sm:flex-row sm:items-center justify-end gap-2"
      >
        <label for="customer-select" class="mr-2">Cliente:</label>
        <USelectMenu
          id="customer-select"
          v-model="selectedCustomer"
          :items="customerOptions"
          :loading="loadingCustomers"
          placeholder="Selecione um cliente"
          class="w-64"
          searchable
          searchable-placeholder="Buscar cliente..."
        />
      </div>
    </div>

    <!-- Grid 1: Tabela de Tickets Vencidos (com rolagem) -->
    <UCard :ui="{ body: { padding: 'p-0' } }">
      <template #header>
        <div
          class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
        >
          <h2 class="text-lg font-semibold text-gray-600">Tickets Vencidos</h2>

          <!-- Controles de Paginação no Cabeçalho -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">Itens por página:</span>
              <!-- Seletor de Limite -->
              <!-- @update:model-value="onLimitChange" garante o reset da página e refresh -->
              <USelect
                v-model="limit"
                :items="[50, 100, 150, 200]"
                class="w-20"
                size="sm"
              />
            </div>

            <span class="text-sm font-medium text-gray-700">
              Total: {{ totalTickets }}
            </span>
          </div>
        </div>
      </template>

      <!-- Container com rolagem vertical e horizontal -->
      <div class="overflow-auto max-h-[350px]">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-hard text-gray-500 uppercase tracking-wider"
              >
                DATA ABERTURA
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-hard text-gray-500 uppercase tracking-wider"
              >
                TEMPO VENCIDO
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-hard text-gray-500 uppercase tracking-wider"
              >
                ASSUNTO
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-hard text-gray-500 uppercase tracking-wider"
              >
                VIP
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-hard text-gray-500 uppercase tracking-wider"
              >
                CLIENTE
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loading State -->
            <tr v-if="loadingTickets">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                <UIcon
                  name="i-lucide-loader-2"
                  class="animate-spin w-6 h-6 mx-auto mb-2"
                />
                Carregando tickets...
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="expiredTickets.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                Nenhum ticket vencido encontrado.
              </td>
            </tr>

            <!-- Lista Real -->
            <tr
              v-for="(ticket, index) in expiredTickets"
              v-else
              :key="index"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Data Abertura -->
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ formatDate(ticket.data_criacao) }}
              </td>

              <!-- Tempo Vencido (Dias) -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-red-600 font-bold">
                  {{ minutesToDays(ticket.tempo_vencido_minutos) }}
                </span>
              </td>

              <!-- Assunto -->
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate"
                :title="ticket.titulo"
              >
                {{ ticket.titulo }}
              </td>

              <!-- VIP (Ícone) -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center">
                  <UIcon
                    v-if="ticket.user_vip === 'Sim'"
                    name="i-lucide-check-circle"
                    class="text-green-500 w-5 h-5"
                    title="VIP: Sim"
                  />
                  <UIcon
                    v-else
                    name="i-lucide-x-circle"
                    class="text-gray-400 w-5 h-5"
                    title="VIP: Não"
                  />
                </div>
              </td>

              <!-- Cliente -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ ticket.compania_nome }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Rodapé com Paginação -->
      <template #footer>
        <div class="flex flex-wrap justify-center items-center gap-2 py-2">
          <!-- Botão Primeira Página -->
          <UButton
            icon="i-lucide-chevrons-left"
            color="gray"
            variant="ghost"
            size="sm"
            :disabled="page === 1 || loadingTickets"
            title="Primeira página"
            @click="page = 1"
          />

          <!--
            Componente de Paginação
            Nota: O watcher no script cuidará do reload quando 'page' mudar.
          -->
          <UPagination
            v-model="page"
            :page-count="limit"
            :total="totalTickets"
            :max="7"
            :disabled="loadingTickets"
            :prev-button="{
              icon: 'i-lucide-chevron-left',
              color: 'gray',
              variant: 'ghost',
            }"
            :next-button="{
              icon: 'i-lucide-chevron-right',
              color: 'gray',
              variant: 'ghost',
            }"
          />

          <!-- Botão Última Página -->
          <UButton
            icon="i-lucide-chevrons-right"
            color="gray"
            variant="ghost"
            size="sm"
            :disabled="page === pageCount || loadingTickets"
            title="Última página"
            @click="page = pageCount"
          />
        </div>
      </template>
    </UCard>

    <!-- Grid 2: Termômetros de Satisfação -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <!-- Termômetro 1: Tempo de Resposta -->
      <DashBase
        dash-name="Tempo de Resposta (SLA)"
        :title-style="chartTitleClass"
      >
        <div class="flex items-center justify-center h-full">
          <!-- Usamos o componente que você já tem -->
          <SatisfactionMeter
            :chart-data="tempoRespostaData"
            center-label="Tempo Médio"
          />
        </div>
      </DashBase>

      <!-- Termômetro 2: Satisfação do Cliente -->
      <DashBase
        dash-name="Satisfação do Cliente (CSAT)"
        :title-style="chartTitleClass"
      >
        <div class="flex items-center justify-center h-full">
          <SatisfactionMeter
            :chart-data="satisfacaoClienteData"
            center-label="CSAT"
          />
        </div>
      </DashBase>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRuntimeConfig, useToast } from "#imports";
import DashBase from "~/components/DashBase.vue";
import SatisfactionMeter from "~/components/SatisfactionMeter.vue";
import type { GaugeResponse } from "~/types/interfaces"; // Importa a interface que o SatisfactionMeter espera

// --- CONFIGURAÇÃO ---
const config = useRuntimeConfig();
const toast = useToast();
const chartTitleClass = "text-gray-500 font-medium text-xl";

// --- ESTADOS ---
const loadingCustomers = ref(false);
const selectedCustomer = ref<string | null>(null);
const customerOptions = ref<string[]>([]); // Lista de nomes de clientes
const loadingTickets = ref(false);
const expiredTickets = ref<ExpiredTicket[]>([]);
const totalTickets = ref(0);

// Estado da Paginação
const page = ref(1);
const limit = ref(50); // Valor padrão inicial

// Computed para total de páginas (usado nos botões de primeira/última página)
const pageCount = computed(() => {
  if (totalTickets.value === 0) return 1;
  return Math.ceil(totalTickets.value / limit.value);
});

// --- INTERFACES ---
// Interface para tipar a resposta da API de Companies
interface Company {
  company_id: number;
  name: string;
  cnpj: string;
}

interface CompaniesResponse {
  companies: Company[];
}

// Interface para os tickets vencidos resposta da API
interface ExpiredTicket {
  tempo_vencido_minutos: number;
  data_criacao: string;
  titulo: string;
  compania_nome: string;
  user_vip: string; // "Sim" ou "Não"
}

interface ExpiredTicketsResponse {
  items: ExpiredTicket[];
  total: number;
  limit: number;
  offset: number;
}

// --- HELPERS DE FORMATAÇÃO ---
// Formata Data ISO para dd/mm/aaaa
function formatDate(isoDate: string): string {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

// Converte minutos para dias INTEIROS com formatação pt-BR (ex: 1.058 dias)
function minutesToDays(minutes: number): string {
  if (!minutes) return "0 dias";
  const days = minutes / 1440; // 1440 minutos em um dia
  // Formata sem casas decimais (arredonda automaticamente pelo Intl ou math se preferir explícito)
  const formatted = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0, // Remove as casas decimais
  }).format(days);
  return `${formatted} dias`;
}

// --- FETCH DATA ---
// 1. Busca a lista de companies para popular o select de clientes
async function fetchCompanies() {
  loadingCustomers.value = true;
  try {
    const res = await $fetch<CompaniesResponse>(
      `${config.public.apiBase}/dashboard/companies`,
    );

    if (res && Array.isArray(res.companies)) {
      // Mapeia apenas o nome da empresa para o array de opções
      customerOptions.value = res.companies.map((c) => c.name).sort();
    } else {
      console.error("Formato de resposta inválido para companies:", res);
      toast.add({
        title: "Erro ao carregar lista de clientes",
        description: "Formato de dados inesperado.",
        color: "red",
      });
    }
  } catch (error) {
    console.error("Erro ao buscar companies:", error);
    toast.add({
      title: "Erro de conexão",
      description: "Não foi possível carregar a lista de clientes.",
      color: "red",
    });
  } finally {
    loadingCustomers.value = false;
  }
}

// 2. Buscar Tickets Vencidos
/* Manipulador de mudança de limite (Dropdown de itens por página)
function onLimitChange() {
  page.value = 1; // Volta para a primeira página
  fetchExpiredTickets(); // Recarrega os dados
}*/

async function fetchExpiredTickets() {
  if (loadingTickets.value) return; // Evita chamadas duplicadas se já estiver carregando
  loadingTickets.value = true;
  // Cálculo do offset: (página atual - 1) * itens por página
  const offset = (page.value - 1) * limit.value;

  try {
    const res = await $fetch<ExpiredTicketsResponse>(
      `${config.public.apiBase}/dashboard/expired_tickets_list?limit=${limit.value}&offset=${offset}`,
    );

    if (res && Array.isArray(res.items)) {
      expiredTickets.value = res.items;
      totalTickets.value = res.total;
    } else {
      console.error("Formato inválido:", res);
      expiredTickets.value = [];
      totalTickets.value = 0;
    }
  } catch (error) {
    console.error("Erro tickets:", error);
    toast.add({ title: "Erro ao carregar tickets", color: "red" });
    expiredTickets.value = [];
  } finally {
    loadingTickets.value = false;
  }
}

// --- WATCHERS (CORREÇÃO 3: Reativados para garantir o fluxo correto) ---
// 1. Observa mudança de página (acionado pelo UPagination ou botões)
watch(page, () => {
  fetchExpiredTickets();
});

// 2. Observa mudança no limite por página
watch(limit, () => {
  // Se não estivermos na página 1, voltar para a 1 vai disparar o watcher de 'page' acima,
  // que por sua vez chama o fetch.
  if (page.value !== 1) {
    page.value = 1;
  } else {
    // Se já estivermos na página 1, precisamos chamar o fetch manualmente
    // pois o watcher de 'page' não será disparado.
    fetchExpiredTickets();
  }
});

// --- DADOS MOCKADOS ---
// Valores dos termômetros (mockados)
const tempoRespostaData = ref<GaugeResponse>({
  datasets: [{ data: [85, 15], label: "SLA" }],
});
const satisfacaoClienteData = ref<GaugeResponse>({
  datasets: [{ data: [65, 35], label: "CSAT" }],
});

onMounted(() => {
  fetchCompanies();
  fetchExpiredTickets();
});
</script>
