// app/pages/index.vue
<template>
  <div class="flex flex-col p-2 main-content">
    <div>
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold">KPI Cards</h1>
        <TimeFilter @update-range="onRangeUpdate" />
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
        <MetricsCard v-if="metrics_cards[0]" :payload="metrics_cards[0]" />
        <MetricsCard v-if="metrics_cards[1]" :payload="metrics_cards[1]" />
        <MetricsCard v-if="metrics_cards[2]" :payload="metrics_cards[2]" />
        <MetricsCard v-if="metrics_cards[3]" :payload="metrics_cards[3]" />
      </div>
    </div>

    <div id="charts" class="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-4">
      <dash-base
        class="col-span-1 lg:col-span-2 col-start-1"
        :dash-name="dashNameList[0] ?? ''"
        :title-style="chartTitleClass"
      >
        <ChartTicketsByCategory :chart-data="TicketsByCategoryData" />
      </dash-base>

      <dash-base
        :dash-name="dashNameList[1] ?? ''"
        :title-style="chartTitleClass"
      >
        <div class="flex flex-col h-full">
          <div class="flex-1">
            <ChartCriticalProjects :chart-data="CriticalProjectsData" />
          </div>

          <CustomLegend
            :labels="CriticalProjectsData.labels ?? []"
            :colors="CriticalProjectsData.datasets[0]?.backgroundColor ?? []"
          />
        </div>
      </dash-base>

      <dash-base
        :dash-name="dashNameList[2] ?? ''"
        :title-style="chartTitleClass"
      >
        <SatisfactionMeter
          :chart-data="teste_gauge"
          :center-label="teste_gauge.datasets[0].label"
        />
      </dash-base>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ChartData, ChartDataset } from "chart.js";
import { useToast, useRuntimeConfig } from "#imports";
import ChartTicketsByCategory from "~/components/ChartTicketsByCategory.vue";
import ChartCriticalProjects from "~/components/ChartCriticalProjects.vue";
import TimeFilter from "~/components/TimeFilter.vue"; // Adicionando importação de componente
import CustomLegend from "~/components/CustomLegend.vue";
import MetricsCard from "~/components/MetricsCard.vue";
import LazyTermsModal from "#components";
import type {
  MetricsCardResponse,
  CriticalProjectsResponse,
  TicketsByCategory,
  GaugeResponse,
} from "~/types/interfaces";

definePageMeta({
  middleware: "root-redirect",
});

const chartTitleClass = "text-gray-500 font-medium text-xl";

const dashNameList = [
  "Evolução de Chamados por Categoria",
  "Projetos Críticos",
  "Subcategorias Críticas",
];

const toast = useToast();
const config = useRuntimeConfig();

type TicketsDataset = ChartDataset<"line", number[]>;

const CriticalCategoriesData = ref<ChartData<"doughnut", number[], string>>({
  labels: [],
  datasets: [],
});

const teste_gauge: GaugeResponse = {
  datasets: [
    {
      data: [90, 10],
      label: "Satisfação",
    },
  ],
};

const CriticalProjectsData = ref<ChartData<"bar", number[], string>>({
  labels: [],
  datasets: [],
});

const TicketsByCategoryData = ref<ChartData<"line", number[], string>>({
  labels: [],
  datasets: [],
});

const colors = [
  "#1E78B6", // Azul
  "#EF4444", // Vermelho
  "#10B981", // Verde
  "#F59E0B", // Amarelo
  "#8B5CF6", // Roxo
  "#EC4899", // Rosa
  "#14B8A6", // Turquesa
  "#F97316", // Laranja
  "#6366F1", // Indigo
  "#E11D48", // Vermelho Escuro
];

// Função utilitária para pegar o último dia disponível
function getLastDateKey(obj: Record<string, unknown>) {
  const keys = Object.keys(obj);
  return keys.sort().at(-1) ?? "";
}

// Função utilitária para pegar os dados de um período
function getDataByPeriod(
  obj: Record<string, unknown>,
  start: string,
  end: string,
): unknown[] {
  const keys = Object.keys(obj)
    .filter((date) => date >= start && date <= end)
    .sort();
  return keys.map((date) => (obj as Record<string, unknown[]>)[date]).flat();
}

// Função para somar counts por nome
function sumByName(arr: { name: string; count: number }[]) {
  const map = new Map<string, number>();
  arr.forEach((item) => {
    map.set(item.name, (map.get(item.name) ?? 0) + item.count);
  });
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

// Novo range: de azul escuro (#001a33) até azul claro (#3B9ADB)
function getBlueShade(value: number, min: number, max: number) {
  const ratio = (value - min) / Math.max(1, max - min);
  // Azul escuro: r=0, g=26, b=51
  // Azul claro:  r=59, g=154, b=219
  const r = Math.round(0 + ratio * (59 - 0));
  const g = Math.round(26 + ratio * (154 - 26));
  const b = Math.round(51 + ratio * (219 - 51));
  return `rgb(${r},${g},${b})`;
}

async function fetchMetricsCard(
  kpi_id: number,
): Promise<MetricsCardResponse | null> {
  try {
    let rota = `${config.public.apiBase}`;

    if (kpi_id === 1) {
      rota += `/dashboard/total_expired_tickets`;
    } else {
      rota += `/kpi/${kpi_id}`;
    }
    const res = await $fetch<MetricsCardResponse>(rota, { method: "GET" });

    if (kpi_id === 1) {
      const obj: MetricsCardResponse = {
        titulo_metrica: "Total de Chamados Vencidos",
        valor_metrica: res.total_expired_tickets.toString(),
        top_limit: "-",
        bottom_limit: "-",
        relation: false,
      };
      return obj;
    }

    return res;
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    return null;
  }
}

async function checkUserAcceptance(user_id: number) {
  try {
    return await $fetch(
      `${config.public.apiBase}/terms/check_user_acceptance?user_id=${user_id}`,
    );
  } catch (err) {
    console.error("Erro:", err);
  }
}

async function fetchCriticalCategories(params?: {
  start_date?: string;
  end_date?: string;
}) {
  try {
    const res = await $fetch<Record<string, unknown>>(
      `${config.public.apiBase}/dashboard/categories`,
    );

    let data: { name: string; count: number }[] = [];
    if (params?.start_date && params?.end_date) {
      data = getDataByPeriod(res, params.start_date, params.end_date) as {
        name: string;
        count: number;
      }[];
      data = sumByName(data); // soma por nome
    } else {
      const lastDate = getLastDateKey(res);
      data = (res[lastDate] as { name: string; count: number }[]) ?? [];
    }

    // Calcula min/max para escala
    const counts = data.map((c) => c.count);
    const min = Math.min(...counts);
    const max = Math.max(...counts);

    CriticalCategoriesData.value = {
      labels: data.map((c) => c.name),
      datasets: [
        {
          label: "Categorias Críticas",
          data: data.map((c) => c.count),
          backgroundColor: data.map((c) => getBlueShade(c.count, min, max)),
          borderWidth: 1,
        },
      ],
    };
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    toast.add({
      title: `Erro ao carregar dados do gráfico: ${dashNameList[2] ?? ""}`,
    });
  }
}

async function fetchCriticalProjects(params?: {
  start_date?: string;
  end_date?: string;
}) {
  try {
    const query =
      params?.start_date && params?.end_date
        ? `?start_date=${params.start_date}&end_date=${params.end_date}`
        : "";

    // CORREÇÃO 1: Tipagem correta para a resposta da API (um array com um objeto dentro)
    const result = await $fetch<CriticalProjectsResponse[]>(
      `${config.public.apiBase}/dashboard/critical_projects${query}`,
    );
    // CORREÇÃO 2: Extrai o array de linhas de projetos de dentro da resposta
    const projectRows = result?.[0]?.rows;

    if (!projectRows || !Array.isArray(projectRows)) {
      console.error("Resposta inválida ou sem 'rows' no backend:", result);
      toast.add({
        title: `Erro ao carregar dados do gráfico: ${dashNameList[1] ?? ""}`,
      });
      return;
    }

    // LÓGICA RESTAURADA: Gera um único dataset, como no seu código original
    CriticalProjectsData.value = {
      // CORREÇÃO 3: Mapeia o nome do projeto (product_name) e junta com a formatação original
      labels: projectRows.map((p) =>
        _formatLabel(p.product_name, 18).join(" "),
      ),
      datasets: [
        {
          label: "Projetos Críticos",
          // CORREÇÃO 4: Mapeia a contagem de tickets (open_tickets)
          data: projectRows.map((p) => p.open_tickets),
          borderWidth: 1,
          backgroundColor: projectRows.map(
            (_, index) => colors[index % colors.length],
          ),
          // Antes estava: backgroundColor: colors[0],  Agora, mapeamos o array de cores para que cada projeto tenha uma cor diferente.
        },
      ],
    };
  } catch (error) {
    console.error("Erro ao buscar projetos críticos:", error);
    toast.add({
      title: `Erro ao carregar dados do gráfico: ${dashNameList[1] ?? ""}`,
    });
  }
}

async function fetchTicketsByCategory(params?: {
  start_date?: string;
  end_date?: string;
}) {
  try {
    const query =
      params?.start_date && params?.end_date
        ? `?start_date=${params.start_date}&end_date=${params.end_date}`
        : "";

    const result = await $fetch<TicketsByCategory>(
      `${config.public.apiBase}/dashboard/tickets_evolution${query}`,
    );

    const res = result.itens;

    if (!res || !Array.isArray(res)) {
      console.error("Resposta inválida do backend:", res);
      toast.add({
        title: `Erro ao carregar dados do gráfico: ${dashNameList[0] ?? ""}`,
      });
      return;
    }

    //    const abscissa = res.map((c) => c.abscissa);
    // CORREÇÃO: Mapeamento para traduzir os meses
    const monthMap: { [key: string]: string } = {
      Jan: "Jan",
      Feb: "Fev",
      Mar: "Mar",
      Apr: "Abr",
      May: "Mai",
      Jun: "Jun",
      Jul: "Jul",
      Aug: "Ago",
      Sep: "Set",
      Oct: "Out",
      Nov: "Nov",
      Dec: "Dez",
    };

    const abscissa = res.length > 0 ? res[0].abscissa : [];

    // Traduz as datas do eixo X
    const translatedAbscissa = abscissa.map((dateString) => {
      const [month, year] = dateString.split("/");
      const translatedMonth = monthMap[month] || month; // Usa a tradução ou mantém o original se não encontrar
      return `${translatedMonth}/${year}`;
    });

    TicketsByCategoryData.value = {
      //      labels: abscissa[0] ?? [], // usa a abscissa da primeira categoria
      labels: translatedAbscissa, // Usa o array de datas traduzidas
      datasets: res.map<TicketsDataset>((c, index) => ({
        label: c.name,
        data: c.count,
        borderColor: colors[index],
        backgroundColor: colors[index],
      })),
    };
  } catch (error) {
    console.error("Erro ao buscar tickets:", error);
    toast.add({
      title: `Erro ao carregar dados do gráfico: ${dashNameList[0] ?? ""}`,
    });
  }
}

function onRangeUpdate(payload: { start_date: string; end_daet: string }) {
  fetchCriticalCategories(payload);
  fetchCriticalProjects(payload);
  fetchTicketsByCategory(payload);
  iterate_metrics_card_();
}

const metrics_cards = ref<MetricsCardResponse[]>([]);

async function iterate_metrics_card_() {
  const requests = [1, 2, 3, 4].map((id) => fetchMetricsCard(id));
  const results = await Promise.all(requests);

  // ✅ Atualiza o estado reativo — ESSENCIAL
  metrics_cards.value = results.filter(
    (r) => r !== null,
  ) as MetricsCardResponse[];
}

const _formatLabel = (str: string, maxLength: number): string[] => {
  // Renomeado para _formatLabel
  const words = str.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if (
      (currentLine + " " + word).trim().length > maxLength &&
      currentLine.length > 0
    ) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine ? `${currentLine} ${word}` : word;
    }
  }
  lines.push(currentLine);

  if (lines.length <= 1) {
    return lines;
  }
  // CORREÇÃO: Remove a lógica de padEnd (originalmente comentada)
  //const longestLineLength = Math.max(...lines.map((line) => line.length));
  //return lines.map((line) => line.padEnd(longestLineLength, " "));
  return lines;
};

const overlay = useOverlay();

onMounted(async () => {
  const result = await checkUserAcceptance(1);

  if (!result.accepted) {
    const modal = overlay.create(LazyTermsModal);

    const instance = modal.open({
      latest_terms: result.latest_terms,
    });

    const accepted = await instance.result;

    if (accepted) {
      // chamar sua API salvando o aceite
      await acceptTerms(result.latest_terms.id);
      reloadDashboard();
    }
  } else {
    reloadDashboard();
  }
});

function reloadDashboard() {
  fetchCriticalCategories();
  fetchCriticalProjects();
  fetchTicketsByCategory();
  iterate_metrics_card_();
}
</script>
