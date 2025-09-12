import { mount } from "@vue/test-utils";
import AppAlert from "../app/components/AppAlert.vue";

test("renders properly", () => {
  const wrapper = mount(AppAlert, {
    props: { msg: "Hello Vitest" },
  });
  expect(wrapper.text()).toContain("Hello Vitest");
});

test("renders another message", () => {
  const wrapper = mount(AppAlert, {
    props: { msg: "Testando mensagem" },
  });
  expect(wrapper.find("h1").text()).toBe("Testando mensagem");
});

test("renders empty message", () => {
  const wrapper = mount(AppAlert, {
    props: { msg: "" },
  });
  expect(wrapper.find("h1").text()).toBe("");
});
