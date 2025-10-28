/* eslint-disable @typescript-eslint/no-explicit-any */

import { config } from "@vue/test-utils";
import { vi } from "vitest";
import { ref } from "vue";

// 🧩 Mock global ResizeObserver (usado por Chart.js)
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })) as any;
}

// 🧩 Mock básico de window/document (caso o jsdom não inicialize antes do Chart.js)
if (!globalThis.window) globalThis.window = {} as any;
if (!globalThis.document) {
  globalThis.document = {
    createElement: () => ({}),
    body: {},
  } as any;
}

// 🧩 Mock #imports (evita erro "Cannot find module '#imports'")
vi.mock("#imports", () => ({
  useState: (key: string, init?: any) => {
    let state = init ?? null;
    return {
      value: state,
      get: () => state,
      set: (v: any) => (state = v),
    };
  },
  useRuntimeConfig: () => ({
    public: { apiBase: "http://localhost:3000" },
  }),
}));

// 🧩 Stubs de componentes Nuxt/UI
config.global.stubs = {
  NuxtLink: true,
  ClientOnly: true,
  UCard: true,
};

// 🧪 Ignora erros e warnings visuais irrelevantes nos testes
// (útil quando Chart.js ou Vue geram logs de warning)
vi.spyOn(console, "error").mockImplementation(() => {});
vi.spyOn(console, "warn").mockImplementation(() => {});

// 🚑 Mock para resolver erro "Missing '#build/root-component.mjs'"
vi.mock("#build/root-component.mjs", () => ({
  default: {},
}));

// Esta simulação agora será global para todos os testes
vi.mock("#imports", () => ({
  useState: vi.fn(() => ref(false)),
}));
