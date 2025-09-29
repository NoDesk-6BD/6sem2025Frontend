import { mount } from "@vue/test-utils";
import ChartCriticalCategories from "../app/components/ChartCriticalCategories.vue";

describe("ChartCriticalCategories", () => {
  it("renders correctly", () => {
    const wrapper = mount(ChartCriticalCategories);
    expect(wrapper.exists()).toBe(true);
  });
});
