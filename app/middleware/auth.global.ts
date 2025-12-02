export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("auth_token");

  // Só intercepta a rota "/"
  if (to.path === "/") {
    if (!token.value) {
      return navigateTo("/login");
    }
    return navigateTo("/dashboard");
  }
  // Se não tiver token e tentar acessar páginas protegidas (exceto login)
  if (!token.value && to.path !== "/login") {
    return navigateTo("/login");
  }

  // Páginas Públicas: Se já tem token e tenta ir pro login, manda pro dashboard
  if (token.value && to.path === "/login") {
    return navigateTo("/dashboard");
  }

  // Controle de Acesso por Role (RBAC) - Apenas no cliente
  if (import.meta.client && token.value) {
    const userRole = localStorage.getItem("user_role");

    // Viewer não pode ver /users
    if (userRole === "viewer" && to.path.startsWith("/users")) {
      return navigateTo("/dashboard");
    }
  }
});
