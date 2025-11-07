// tests/MetricsCard.test.ts
import { mount } from "@vue/test-utils";
import MetricsCard from "../app/components/MetricsCard.vue";

describe("MetricsCard", () => {
  // Teste 1: Adicione props obrigatórias
  it("renders correctly", () => {
    const payload = {
      titulo_metrica: "Título",
      valor_metrica: "0",
      top_limit: 100,
      bottom_limit: 0,
      relation: true,
    };
    const wrapper = mount(MetricsCard, {
      props: payload,
    });
    expect(wrapper.exists()).toBe(true);
  });
});
