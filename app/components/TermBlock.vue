<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
    <!-- Slider -->
    <div
      class="slider-wrapper d-flex flex-column max-w-9"
      @click="toggleAcceptance"
    >
      <USlider :min="0" :max="1" :model-value="sliderValue" />
    </div>

    <!-- Conteúdo -->
    <div class="flex-grow-1">
      <textarea
        class="form-control bg-dark text-light border p-3"
        rows="10"
        readonly
        :value="termContent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "changeValue", payload: { accepted: boolean; termId: number }): void;
}>();

const props = defineProps<{
  termId: number;
  termContent: string;
  isRequired: boolean;
}>();

// Valor controlado do slider
const sliderValue = ref(0);

// Clicou → alterna entre 0 e 1
function toggleAcceptance() {
  sliderValue.value = sliderValue.value === 0 ? 1 : 0;
  acceptanceStatus(sliderValue.value);
}

// Sua lógica atual continua igual
function acceptanceStatus(value: number) {
  const accepted = value === 1;

  emit("changeValue", {
    accepted,
    termId: props.termId,
  });
}
</script>
