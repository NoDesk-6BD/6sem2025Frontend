export function useTerms() {
  const config = useRuntimeConfig();

  async function checkUserAcceptance(user_id: number) {
    try {
      const result = await $fetch(
        `${config.public.apiBase}/terms/check_user_acceptance?user_id=${user_id}`,
      );

      return result.accepted === true;
    } catch (err) {
      console.error("Erro:", err);
      return false;
    }
  }

  return {
    checkUserAcceptance,
  };
}
