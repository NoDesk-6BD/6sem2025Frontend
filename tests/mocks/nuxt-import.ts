// tests/mocks/nuxt-imports.ts
export const useRuntimeConfig = () => ({
  public: { apiBase: "http://localhost:3000" },
});

export const useState = (key, init) => {
  const state = init ?? null;
  return { value: state };
};
