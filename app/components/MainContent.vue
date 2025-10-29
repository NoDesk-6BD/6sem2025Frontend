// app/components/MainContent.vue
<template>
  <UContainer class="main-content">
    <div class="metrics-cards">
      <MetricsCard titulo-metrica="Metrica 1" :valor-metrica="1" />
      <MetricsCard titulo-metrica="Metrica 2" :valor-metrica="2" />
      <MetricsCard titulo-metrica="Metrica 3" :valor-metrica="3" />
      <MetricsCard titulo-metrica="Metrica 4" :valor-metrica="4" />
    </div>

    <div class="dash-boards">
      <dash-base
        component="Dashboard1"
        dash-name="Dashboard 1"
        title-style="style1"
      />
      <dash-base
        component="Dashboard2"
        dash-name="Dashboard 2"
        title-style="style2"
      />
      <dash-base
        component="Dashboard3"
        dash-name="Dashboard 3"
        title-style="style3"
      />
      <dash-base
        component="Dashboard4"
        dash-name="Dashboard 4"
        title-style="style4"
      />
    </div>
  </UContainer>
</template>

<script lang="ts" setup></script>
