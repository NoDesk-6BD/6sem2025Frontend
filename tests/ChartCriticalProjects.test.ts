import { mount } from "@vue/test-utils";
import ChartCriticalProjects from "../app/components/ChartCriticalProjects.vue";

describe("ChartCriticalProjects", () => {
  it("renders correctly", () => {
    const wrapper = mount(ChartCriticalProjects);
    expect(wrapper.exists()).toBe(true);
  });
});
