import { mount } from "@vue/test-utils";
import ChartCriticalCategories from "~/components/ChartCriticalCategories.vue";

it("renders correctly when data is provided", () => {
  // 1. Crie um objeto de dados mock com a estrutura esperada
  const mockChartData = {
    labels: ["Categoria A", "Categoria B", "Categoria C"],
    datasets: [
      {
        label: "Tickets Críticos",
        backgroundColor: "#f87979",
        data: [40, 20, 12],
      },
    ],
  };

  // 2. Passe os dados como prop ao montar o componente
  const wrapper = mount(ChartCriticalCategories, {
    props: {
      data: mockChartData,
    },
  });

  expect(wrapper.exists()).toBe(true);
});
