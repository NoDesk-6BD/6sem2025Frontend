// app/pages/customers.vue
<template>
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
          :options="customerOptions"
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
        <h2 class="text-lg font-semibold text-gray-600">Tickets Vencidos</h2>
      </template>

      <!-- Container com rolagem vertical e horizontal -->
      <div class="overflow-auto max-h-[400px]">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ticket ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Assunto
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Vencimento
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Solicitante
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Dados de Exemplo (serão substituídos por dados reais) -->
            <tr v-for="n in 15" :key="n" class="hover:bg-gray-50">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                TKT-10{{ n }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                Problema no login do sistema X
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                >
                  Vencido
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium"
              >
                1{{ n }}/10/2025
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                usuarioc{{ n }}@cliente.com
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
import { ref } from "vue";
// Importa os componentes de Dash que já usamos
import DashBase from "~/components/DashBase.vue";
import SatisfactionMeter from "~/components/SatisfactionMeter.vue";
import type { GaugeResponse } from "~/types/interfaces"; // Importa a interface que o SatisfactionMeter espera

// --- DADOS MOCK (Exemplos) ---

const chartTitleClass = "text-gray-500 font-medium text-xl";

// Filtro de Cliente
const selectedCustomer = ref(null);
const customerOptions = ref([
  "Cliente Alpha",
  "Cliente Beta",
  "Cliente Omega",
  "Cliente Delta",
  "Cliente Gamma",
]);

// Dados de exemplo para os termômetros
const tempoRespostaData = ref<GaugeResponse>({
  datasets: [
    {
      data: [85, 15], // 85%
      label: "SLA",
    },
  ],
});

const satisfacaoClienteData = ref<GaugeResponse>({
  datasets: [
    {
      data: [65, 35], // 65% (para mostrar a cor vermelha de exemplo)
      label: "CSAT",
    },
  ],
});
</script>
