<template>
  <div class="flex flex-col p-2 main-content">
    <div>
      <div class="grid grid-cols-2">
        <h1 class="text-2xl font-bold mb-4 self-center">KPI Cards</h1>
        <TimeFilter @update-range="onRangeUpdate" />
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
        <MetricsCard
          titulo-metrica="Métrica 1"
          :valor-metrica="3"
          :bottom-limit="4"
          :top-limit="10"
          :relation="true"
        />
        <MetricsCard
          titulo-metrica="Métrica 2"
          :valor-metrica="6"
          :bottom-limit="3"
          :top-limit="10"
          :relation="false"
        />
        <MetricsCard
          titulo-metrica="Métrica 3"
          :valor-metrica="9"
          :bottom-limit="3"
          :top-limit="10"
          :relation="true"
        />
        <MetricsCard
          titulo-metrica="Métrica 4"
          :valor-metrica="12"
          :bottom-limit="5"
          :top-limit="10"
          :relation="true"
        />
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
        <ChartCriticalProjects :chart-data="CriticalProjectsData" />
      </dash-base>

      <dash-base
        :dash-name="dashNameList[2] ?? ''"
        :title-style="chartTitleClass"
      >
        <ChartCriticalCategories :chart-data="CriticalCategoriesData" />
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
import ChartCriticalCategories from "../components/ChartCriticalCategories.vue";
import TimeFilter from "~/components/TimeFilter.vue"; // Adicionando importação de componente

const chartTitleClass = "text-gray-500 font-medium text-xl";

const dashNameList = [
  "Chamados por Categoria",
  "Projetos Críticos",
  "Categorias Críticas",
];

const toast = useToast();

interface Category {
  id: string;
  name: string;
  count: number[];
  abscissa: string[];
}

interface TicketsByCategory {
  itens: Category[];
}

// NOVAS INTERFACES para o JSON retornado pelo backend
interface CriticalProjectRow {
  product_id: number;
  product_name: string;
  open_tickets: number;
}

interface CriticalProjectsResponse {
  id: string;
  generated_at: string;
  limit: number;
  open_status_ids: number[];
  rows: CriticalProjectRow[]; // Onde a lista de projetos reside
}

type TicketsDataset = ChartDataset<"line", number[]>;

const CriticalCategoriesData = ref<ChartData<"doughnut", number[], string>>({
  labels: [],
  datasets: [],
});

const CriticalProjectsData = ref<ChartData<"bar", number[], string>>({
  labels: [],
  datasets: [],
});

const TicketsByCategoryData = ref<ChartData<"line", number[], string>>({
  labels: [],
  datasets: [],
});

const colorsDoughnut = ["#005691", "#2C89C9", "#1E78B6", "#0F67A4", "#3B9ADB"];

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

async function fetchCriticalCategories(params?: {
  start_date?: string;
  end_date?: string;
}) {
  try {
    const config = useRuntimeConfig();

    // monta query string somente se tiver params válidos
    const query =
      params?.start_date && params?.end_date
        ? `?start_date=${params.start_date}&end_date=${params.end_date}`
        : "";

    const res = await $fetch<Category[]>(
      `${config.public.apiBase}/dashboard/categories${query}`,
    );

    if (!res || !Array.isArray(res)) {
      console.error("Resposta inválida do backend:", res);
      toast.add({
        title: `Erro ao carregar dados do gráfico: ${dashNameList[2] ?? ""}`,
      });
      return;
    }

    CriticalCategoriesData.value = {
      labels: res.map((c) => c.name),
      datasets: [
        {
          label: "Categorias Críticas",
          data: res.flatMap((c) => c.count),
          backgroundColor: colorsDoughnut.slice(0, res.length),
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
    const config = useRuntimeConfig();

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
          backgroundColor: colors[0],
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
    const config = useRuntimeConfig();

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

function onRangeUpdate(payload: { start_date: string; end_date: string }) {
  fetchCriticalCategories(payload);
  fetchCriticalProjects(payload);
  fetchTicketsByCategory(payload);
}

// chamada inicial sem filtros → pega os 60 dias do backend
fetchCriticalCategories();
fetchCriticalProjects();
fetchTicketsByCategory();

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

onMounted(() => {
  fetchTicketsByCategory();
  fetchCriticalProjects();
  fetchCriticalCategories();
});
</script>
