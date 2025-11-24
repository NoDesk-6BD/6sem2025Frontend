<template>
  <!-- app/pages/customers.vue -->
  <div class="flex flex-col p-6 main-content">
    <!-- Cabeçalho da página -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2"
    >
      <h1 class="text-2xl font-bold">Visão do Cliente</h1>

      <!-- Filtro de Clientes -->
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
          value-attribute="value"
          label-attribute="label"
          mode="single"
          by="value"
        />
      </div>
    </div>

    <!-- GRID 1: Tabela de Tickets Vencidos -->
    <UCard :ui="{ body: { padding: 'p-0' } }">
      <!-- Cabeçalho da Tabela -->
      <template #header>
        <div
          class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
        >
          <h2 class="text-lg font-semibold text-gray-600">Tickets Vencidos</h2>

          <!-- Controles de Paginação: Itens por página -->
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-500">Itens por página:</span>
            <USelect
              v-model="limit"
              :items="[50, 100, 150, 200]"
              class="w-20"
              size="sm"
            />
          </div>
        </div>
      </template>

      <!-- Container tabela with scroll -->
      <div class="overflow-auto max-h-[325px]">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-hard text-gray-500 uppercase tracking-wider"
              >
                DATA ABERTURA
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-hard text-gray-500 uppercase tracking-wider"
              >
                TEMPO VENCIDO
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-hard text-gray-500 uppercase tracking-wider"
              >
                ASSUNTO
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-hard text-gray-500 uppercase tracking-wider"
              >
                VIP
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-hard text-gray-500 uppercase tracking-wider"
              >
                CLIENTE
              </th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Estado: Carregando -->
            <tr v-if="loadingTickets">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                <UIcon
                  name="i-lucide-loader-2"
                  class="animate-spin w-6 h-6 mx-auto mb-2"
                />
                Carregando tickets...
              </td>
            </tr>

            <!-- Estado: Lista vazia -->
            <tr v-else-if="expiredTickets.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                Nenhum ticket vencido encontrado.
              </td>
            </tr>

            <!-- Lista de tickets -->
            <tr
              v-for="(ticket, index) in filteredTickets"
              :key="index"
              class="hover:bg-gray-50 transition-colors"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ formatDate(ticket.data_criacao) }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-red-600 font-bold">
                  {{ minutesToDays(ticket.tempo_vencido_minutos) }}
                </span>
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate"
                :title="ticket.titulo"
              >
                {{ ticket.titulo }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-center">
                <UIcon
                  v-if="ticket.user_vip === 'Sim'"
                  name="i-lucide-check-circle"
                  class="text-green-500 w-5 h-5"
                />
                <UIcon
                  v-else
                  name="i-lucide-x-circle"
                  class="text-gray-400 w-5 h-5"
                />
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ ticket.compania_nome }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Rodapé com Paginação -->
      <template #footer>
        <div
          class="flex flex-wrap justify-between items-center gap-4 py-2 px-4"
        >
          <!-- Total Geral ESQUERDA -->
          <span class="text-sm font-medium text-gray-700">
            Total geral: {{ formatNumber(totalExpiredGlobal) }}
          </span>

          <!-- Paginação CENTRALIZADA -->
          <div class="flex justify-center flex-grow">
            <UPagination
              v-if="pageCount > 1"
              :key="paginationKey"
              v-model:page="page"
              :page-count="pageCount"
              :total="totalExpiredGlobal"
              :max="5"
              show-last
              show-first
            />
          </div>

          <!-- Botão CSV-->
          <UButton
            :loading="csvLoading"
            :disabled="csvLoading"
            icon="i-lucide-download"
            color="gray"
            variant="solid"
            size="sm"
            class="transition-colors duration-200 hover:bg-blue-600 hover:text-white"
            @click="downloadCsv"
          >
            <span v-if="!csvLoading">Baixar CSV</span>
            <span v-else>Gerando...</span>
          </UButton>

          <!-- Total filtrado DIREITA -->
          <span class="text-sm font-medium text-blue-600">
            Total filtrado: {{ formatNumber(totalFiltered) }}
          </span>
        </div>
      </template>
    </UCard>

    <!-- GRID 2: Termômetros -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <DashBase
        dash-name="Tempo de Resposta (SLA)"
        :title-style="chartTitleClass"
      >
        <div class="flex items-center justify-center h-full">
          <SatisfactionMeter
            :chart-data="tempoRespostaData"
            center-label="Tempo Médio"
          />
        </div>
      </DashBase>

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
import type { GaugeResponse } from "~/types/interfaces";

// -------------------------------
// CONFIGURAÇÕES
// -------------------------------
const config = useRuntimeConfig();
const toast = useToast();
const chartTitleClass = "text-gray-500 font-medium text-xl";

// -------------------------------
// ESTADOS
// -------------------------------
const loadingCustomers = ref(false);
const selectedCustomer = ref<number | null>(null);
const customerOptions = ref<{ label: string; value: number | null }[]>([]);
const loadingTickets = ref(false);
const expiredTickets = ref<ExpiredTicket[]>([]);
const totalTickets = ref(0);
const totalExpiredGlobal = ref(0);
const paginationKey = ref(0);
const totalFiltered = ref(0);
const csvLoading = ref(false);

// Paginação
const page = ref(1);
const limit = ref(50);
const offset = computed(() => (page.value - 1) * limit.value);

// Total de páginas
const pageCount = computed(() => {
  if (totalExpiredGlobal.value === 0) return 0; // Ainda não carregou
  return Math.ceil(totalExpiredGlobal.value / limit.value);
});

// Filtra tickets pelo cliente selecionado
const filteredTickets = computed(() => expiredTickets.value);

// -------------------------------
// INTERFACES
// -------------------------------
interface Company {
  company_id: number;
  name: string;
  cnpj: string;
}

interface CompaniesResponse {
  companies: Company[];
}

interface ExpiredTicket {
  tempo_vencido_minutos: number;
  data_criacao: string;
  titulo: string;
  compania_nome: string;
  user_vip: string;
}

interface ExpiredTicketsResponse {
  items: ExpiredTicket[];
  total: number;
  limit: number;
  offset: number;
}

// -------------------------------
// HELPERS
// -------------------------------
function formatDate(isoDate: string) {
  return isoDate
    ? new Intl.DateTimeFormat("pt-BR").format(new Date(isoDate))
    : "-";
}

function minutesToDays(minutes: number) {
  const days = minutes / 1440;
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(
    days,
  )} dias`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value || 0);
}

function getCompanyId(
  selectedCustomer: { label: string; value: number } | number | null,
): number | undefined {
  if (selectedCustomer === null) return undefined;
  if (typeof selectedCustomer === "number") return selectedCustomer;
  if (
    typeof selectedCustomer === "object" &&
    typeof selectedCustomer.value === "number"
  )
    return selectedCustomer.value;
  return undefined;
}

// -------------------------------
// API: Baixar CSV
// -------------------------------
async function downloadCsv() {
  csvLoading.value = true;

  try {
    toast.add({ title: "Gerando CSV...", color: "blue" });

    const allTickets: ExpiredTicket[] = [];
    const pageSize = 200;
    let offsetLocal = 0;

    const total =
      selectedCustomer.value !== null
        ? totalFiltered.value
        : totalExpiredGlobal.value;

    const companyId = getCompanyId(selectedCustomer.value);

    while (offsetLocal < total) {
      const params: { limit: number; offset: number; company_id?: number } = {
        limit: pageSize,
        offset: offsetLocal,
      };

      if (companyId !== undefined) params.company_id = companyId;

      const res = await $fetch<ExpiredTicketsResponse>(
        `${config.public.apiBase}/dashboard/expired_tickets_list`,
        { query: params },
      );

      allTickets.push(...res.items);
      offsetLocal += pageSize;
    }

    // montar CSV
    const header = [
      "Data Abertura",
      "Tempo Vencido (minutos)",
      "Assunto",
      "VIP",
      "Cliente",
    ].join(";");

    const rows = allTickets
      .map((t) =>
        [
          formatDate(t.data_criacao),
          t.tempo_vencido_minutos,
          `"${t.titulo.replace(/"/g, "'")}"`,
          t.user_vip,
          t.compania_nome,
        ].join(";"),
      )
      .join("\n");

    const csv = `${header}\n${rows}`;

    // baixar
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      companyId !== undefined
        ? `tickets_cliente.csv`
        : `tickets_todos_clientes.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.add({ title: "CSV baixado com sucesso!", color: "green" });
  } catch (error) {
    console.error("ERRO CSV:", error);
    toast.add({ title: "Erro ao gerar CSV", color: "red" });
  } finally {
    csvLoading.value = false;
  }
}

// -------------------------------
// API: Busca Total Geral de Tickets Vencidos
// -------------------------------
async function fetchTotalExpiredGlobal() {
  try {
    const res = await $fetch(
      `${config.public.apiBase}/dashboard/total_expired_tickets`,
    );

    if (res?.total_expired_tickets != null) {
      totalExpiredGlobal.value = res.total_expired_tickets;
    } else {
      throw new Error("Formato inesperado na resposta do total.");
    }
  } catch (error) {
    console.error("Erro ao buscar total geral de tickets vencidos:", error);
    toast.add({
      title: "Erro ao carregar total de tickets",
      color: "red",
    });
  }
}

// -------------------------------
// API: Busca Companies
// -------------------------------
async function fetchCompanies() {
  loadingCustomers.value = true;

  try {
    const res = await $fetch<CompaniesResponse>(
      `${config.public.apiBase}/dashboard/companies`,
    );

    if (Array.isArray(res.companies)) {
      customerOptions.value = [
        { label: "Todos os clientes", value: null },
        ...res.companies.map((c) => ({
          label: c.name,
          value: c.company_id,
        })),
      ];
    } else {
      throw new Error("Formato inválido na resposta de companies.");
    }
  } catch (error) {
    console.error("Erro ao buscar companies:", error);
    toast.add({
      title: "Erro ao carregar clientes",
      color: "red",
    });
  } finally {
    loadingCustomers.value = false;
  }
}

// -------------------------------
// API: Busca Tickets Vencidos
// -------------------------------
async function fetchExpiredTickets() {
  if (loadingTickets.value) return;
  loadingTickets.value = true;

  const url = `${config.public.apiBase}/dashboard/expired_tickets_list`;

  const params: { limit: number; offset: number; company_id?: number } = {
    limit: limit.value,
    offset: offset.value,
    company_id: getCompanyId(selectedCustomer.value),
  };

  try {
    const res = await $fetch<ExpiredTicketsResponse>(url, {
      query: params,
      onResponseError({ response }) {
        console.error("❌ ERRO DO BACKEND", response._data);
      },
    });

    expiredTickets.value = res.items;
    totalTickets.value = res.total;

    totalFiltered.value = selectedCustomer.value !== null ? res.total : 0;
  } catch (error: unknown) {
    console.error("❌ ERRO AO BUSCAR TICKETS", error);

    const err = error as { data?: { detail?: string } };

    toast.add({
      title: "Erro ao carregar tickets",
      description: err?.data?.detail || "Falha inesperada.",
      color: "red",
      timeout: 8000,
    });

    expiredTickets.value = [];
    totalTickets.value = 0;
  } finally {
    loadingTickets.value = false;
  }
}

// -------------------------------
// WATCHERS
// -------------------------------
watch(page, () => {
  fetchExpiredTickets();
});

watch(limit, () => {
  page.value = 1; // reset da página
  paginationKey.value++; // força re-render da paginação
  fetchExpiredTickets();
});

watch([totalExpiredGlobal, limit], () => {
  paginationKey.value++;
});

watch(page, (newPage) => {
  if (newPage > pageCount.value) {
    page.value = pageCount.value;
  }
  if (newPage < 1) {
    page.value = 1;
  }
});

watch(selectedCustomer, () => {
  // Quando trocar o cliente, voltar para página 1 e recarregar
  page.value = 1; // Não chamamos fetch novamente pois o filtro é local
  totalFiltered.value = 0; // reseta antes da nova busca
  fetchExpiredTickets();
});

// -------------------------------
// LIFECYCLE
// -------------------------------
onMounted(() => {
  fetchTotalExpiredGlobal();
  fetchCompanies();
  fetchExpiredTickets();
});

// -------------------------------
// MOCKS PARA DASHBOARDS
// -------------------------------
const tempoRespostaData = ref<GaugeResponse>({
  datasets: [{ data: [85, 15], label: "SLA" }],
});

const satisfacaoClienteData = ref<GaugeResponse>({
  datasets: [{ data: [65, 35], label: "CSAT" }],
});
</script>
