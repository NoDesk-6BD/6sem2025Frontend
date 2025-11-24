export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("token");

  // Só intercepta a rota "/"
  if (to.path === "/") {
    if (!token.value) {
      return navigateTo("/login");
    }
    return navigateTo("/dashboard");
  }
});
