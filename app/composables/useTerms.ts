import type { UserTermsAcceptance } from "~/types/interfaces";
import TermsModal from "~/components/TermsModal.vue";

const overlay = useOverlay();

export function useTerms() {
  const config = useRuntimeConfig();

  async function getUserAcceptance(user_id: number) {
    try {
      const result: UserTermsAcceptance = await $fetch(
        `${config.public.apiBase}/terms/check_user_acceptance?user_id=${user_id}`,
      );

      return result.accepted === true;
    } catch (err) {
      console.error("Erro:", err);
      return false;
    }
  }

  async function checkUserAcceptance() {
    const user_id = localStorage.getItem("user_id");
    console.log("Usuário para validar termos:");
    console.log(user_id);
    const result: boolean = await getUserAcceptance(Number(user_id));

    if (!result) {
      const modal = overlay.create(TermsModal);

      const instance = modal.open({
        userId: user_id,
      });

      const accepted = await instance.result;

      if (accepted) {
        console.log("Termos aceitos pelo usuário.");
        return true;
      } else {
        console.log("Termos recusados pelo usuário.");
        return false;
      }
    }
    return true;
  }

  return {
    checkUserAcceptance,
  };
}
