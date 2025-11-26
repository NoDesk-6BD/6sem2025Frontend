<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
    <!-- Coluna do slider -->
    <div class="slider-wrapper d-flex flex-column max-w-9">
      <USlider :min="0" :max="1" :default-value="0" class="mb-3" />
    </div>

    <!-- Coluna do conteúdo -->
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

<script lang="ts" setup>
defineProps<{
  termContent: string;
  isRequired: boolean;
}>();
</script>
