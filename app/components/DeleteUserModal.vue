<template>
  <UModal :model-value="modelValue" @update:model-value="close">
    <div class="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
      <div class="flex items-center gap-3 mb-4 text-red-600 dark:text-red-500">
        <UIcon name="i-lucide-alert-triangle" class="w-6 h-6" />
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          Confirmar Exclusão
        </h3>
      </div>

      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Tem certeza que deseja excluir o usuário
        <strong class="text-black dark:text-white">{{ userName }}</strong
        >?
        <br >
        <span class="text-red-500 text-sm font-semibold">
          Esta ação é irreversível.
        </span>
      </p>

      <div class="flex justify-end gap-3">
        <UButton label="Cancelar" color="gray" variant="ghost" @click="close" />
        <UButton
          label="Sim, Excluir Definitivamente"
          color="red"
          variant="solid"
          :loading="loading"
          @click="confirm"
        />
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
// O Vue 3 usa 'modelValue' como prop padrão para v-model
defineProps<{
  modelValue: boolean;
  userName: string;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
}>();

function close() {
  emit("update:modelValue", false);
}

function confirm() {
  emit("confirm");
}
</script>
