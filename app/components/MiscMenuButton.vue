<template>
  <div class="misc-menu-button">
  <UButton class="menu-button">{{ btnText }}</UButton>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ btnText: string }>()
</script>

<style>

</style>