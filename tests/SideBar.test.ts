// tests/SideBar.test.ts
import { mount } from "@vue/test-utils";
import SideBar from "../app/components/SideBar.vue";

test("renders Dashboard when not collapsed", () => {
  // Agora usamos o 'mount' simples, sem 'async/await'
  const wrapper = mount(SideBar);
  expect(wrapper.text()).toContain("Dashboards");
});

test("renders Logout when not collapsed", () => {
  const wrapper = mount(SideBar);
  expect(wrapper.text()).toContain("Logout");
});
