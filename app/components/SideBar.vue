<template>
  <navbar class="sidebar-content">
    <span>Olá, {{ userName }}!</span>
      <UButtonGroup orientation="vertical" class="sidebar-menu">
        <MiscMenuButton btn-text="Botão 1" />
        <MiscMenuButton btn-text="Botão 2" />
        <MiscMenuButton btn-text="Botão 3" />
        <MiscMenuButton btn-text="Botão 4" />
      </UButtonGroup>
    <UButton color="error" class="log_off-button">Logoff</UButton>
  </navbar>
</template>

<script lang="ts" setup>
defineProps<{ userName: string }>()
</script>


<style>

</style>