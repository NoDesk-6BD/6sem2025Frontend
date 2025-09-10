<template>
  <v-card class="dashboard-card" elevation="2">
    <v-card-title>Dashboard {{ props.dashName }} Card</v-card-title>
    <component :is="props.component" />
  </v-card>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps<{
  component: any,
  dashName: string
}>();
</script>

<style>

</style>