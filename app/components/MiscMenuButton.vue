<template>
  <UButton :to="btnDestination" class="misc-menu-button">
    <span class="menu-button-label">{{ btnText }}</span>
  </UButton>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

defineProps<{
  btnText: string;
  btnDestination: string;
}>();
</script>

<style></style>
