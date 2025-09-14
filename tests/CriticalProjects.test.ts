import { mount } from "@vue/test-utils";
import CriticalProjects from "../app/components/CriticalProjects.vue";

describe("CriticalProjects", () => {
  it("renders correctly", () => {
    const wrapper = mount(CriticalProjects);
    expect(wrapper.exists()).toBe(true);
  });
});
