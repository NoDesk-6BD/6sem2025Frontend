<template>
  <v-card class="dashboard-card" elevation="2">
    <v-card-title>Dashboard {{ props.dashName }} Card</v-card-title>
    <component :is="props.component" />
  </v-card>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

import type { Component } from 'vue';

const props = defineProps<{
  component: string | Component,
  dashName: string
}>();
</script>

<style>

</style>