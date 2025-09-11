<template>
  <v-card class="metrics-card" elevation="2">
    <v-card-text class="metrics-card-value">{{ props.valorMetrica }}</v-card-text>
    <v-card-title class="metrics-card-title">{{ props.tituloMetrica }}</v-card-title>
  </v-card>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps<{
  tituloMetrica: string
  valorMetrica: string
}>();
</script>

<style>
</style>