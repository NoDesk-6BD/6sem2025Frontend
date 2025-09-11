<template>
  <navbar class="sidebar-content">
    <div class="sidebar-header">
      <span>Olá, {{ userName }}!</span>
      <UAvatar :alt="userName" size="md" />
    </div>
      <UButtonGroup orientation="vertical" class="sidebar-menu">
        <MiscMenuButton btn-destination="https://example.com" btn-text="Botão 1" />
        <MiscMenuButton btn-destination="https://example.com" btn-text="Botão 2" />
        <MiscMenuButton btn-destination="https://example.com" btn-text="Botão 3" />
        <MiscMenuButton btn-destination="https://example.com" btn-text="Botão 4" />
      </UButtonGroup>
    <div class="log_off-container">
      <UButton color="error" class="log_off-button">Logoff</UButton>
    </div>
  </navbar>
</template>

<script lang="ts" setup>
defineProps<{ userName: string }>()
</script>


<style>

</style>