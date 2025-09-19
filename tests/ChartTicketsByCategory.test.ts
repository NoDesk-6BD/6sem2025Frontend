import { mount } from "@vue/test-utils";
import ChartTicketsByCategory from "../app/components/ChartTicketsByCategory.vue";

describe("ChartTicketsByCategory", () => {
  it("renders correctly", () => {
    const wrapper = mount(ChartTicketsByCategory);
    expect(wrapper.exists()).toBe(true);
  });
});
