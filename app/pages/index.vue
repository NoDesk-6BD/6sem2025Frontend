<template>
  <div class="main-content">
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

    <div class="grid grid-cols-2 gap-5">
      <dash-base component="Dashboard1" dash-name="Dashboard 1" />
      <dash-base component="Dashboard2" dash-name="Dashboard 2" />
      <critical-projects dash-name="Projetos Críticos" />
      <dash-base component="Dashboard4" dash-name="Dashboard 4" />
    </div>
  </div>
</template>
