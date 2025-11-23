export default defineNuxtRouteMiddleware(() => {
  const token = useCookie("token");

  if (!token.value) {
    return navigateTo("/login");
  }

  return navigateTo("/dashboard");
});
