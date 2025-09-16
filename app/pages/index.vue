<script setup>
const chartTitleClass = "text-gray-500 font-medium text-xl";
</script>

<template>
  <div class="main-content">
    <div>
      <div class="grid grid-cols-2 mb-7">
        <h1 class="text-2xl font-bold mb-4 self-center">KPI Cards</h1>
        <TimeFilter />
      </div>
      <div class="grid grid-cols-4 gap-5 mb-7">
        <MetricsCard
          titulo-metrica="Metrica 1"
          :valor-metrica="15"
          :bottom-limit="3"
          :top-limit="10"
          :relation="true"
        />
        <MetricsCard
          titulo-metrica="Metrica 2"
          :valor-metrica="31"
          :bottom-limit="3"
          :top-limit="10"
          :relation="false"
        />
        <MetricsCard
          titulo-metrica="Metrica 3"
          :valor-metrica="77"
          :bottom-limit="3"
          :top-limit="10"
          :relation="true"
        />
        <MetricsCard
          titulo-metrica="Metrica 4"
          :valor-metrica="42"
          :bottom-limit="40"
          :top-limit="50"
          :relation="true"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-5">
      <dash-base
        component="Dashboard1"
        dash-name="Dashboard 1"
        :title-style="chartTitleClass"
      />
      <dash-base
        component="Dashboard2"
        dash-name="Dashboard 2"
        :title-style="chartTitleClass"
      />
      <critical-projects
        dash-name="Projetos Críticos"
        :title-style="chartTitleClass"
      />
      <dash-base
        component="Dashboard4"
        dash-name="Dashboard 4"
        :title-style="chartTitleClass"
      />
    </div>
  </div>
</template>
