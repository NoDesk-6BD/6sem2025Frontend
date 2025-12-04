<template>
  <div class="grid grid-cols-7 gap-2 mb-2 items-start">
    <!-- Slider + * obrigatório -->
    <div
      class="flex items-center gap-1 cursor-pointer"
      @click="toggleAcceptance"
    >
      <!-- Caixa fixa do slider -->
      <div class="w-9">
        <!-- ajuste a largura como desejar -->
        <USlider :min="0" :max="1" :model-value="sliderValue" />
      </div>

      <!-- Asterisco vermelho -->
      <span
        v-if="isRequired"
        class="text-red-500 font-bold text-lg select-none"
        title="Termo obrigatório"
      >
        *
      </span>
    </div>

    <!-- Conteúdo -->
    <div class="flex-grow col-span-6">
      <textarea
        class="form-control bg-dark text-light border p-3 w-full h-50 rounded"
        rows="10"
        readonly
        :value="termContent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (e: "changeValue", payload: { accepted: boolean; termId: number }): void;
}>();

const props = defineProps<{
  termId: number;
  termContent: string;
  isRequired: boolean;
}>();

const sliderValue = ref(0);

function toggleAcceptance() {
  sliderValue.value = sliderValue.value === 0 ? 1 : 0;
  emit("changeValue", {
    accepted: sliderValue.value === 1,
    termId: props.termId,
  });
}
</script>
