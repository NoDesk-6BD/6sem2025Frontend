import { mount } from "@vue/test-utils";
import ChartCriticalProjects from "../app/components/ChartCriticalProjects.vue";

describe("ChartCriticalProjects", () => {
  it("renders correctly", () => {
    // Crie dados simulados
    const mockChartData = {
      labels: ["Projeto X", "Projeto Y"],
      datasets: [
        {
          label: "Tickets Críticos por Projeto",
          backgroundColor: "#f87979",
          data: [5, 8],
        },
      ],
    };

    // Passe os dados como prop
    const wrapper = mount(ChartCriticalProjects, {
      props: {
        chartData: mockChartData,
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
