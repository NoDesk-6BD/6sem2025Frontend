<template>
  <div class="main-content">
    <div class="grid grid-cols-4 gap-2 mb-5">
      <MetricsCard titulo-metrica="Metrica 1" valor-metrica="1"/>
      <MetricsCard titulo-metrica="Metrica 2" valor-metrica="2"/>
      <MetricsCard titulo-metrica="Metrica 3" valor-metrica="3"/>
      <MetricsCard titulo-metrica="Metrica 4" valor-metrica="4"/>
    </div>
    <div class="dash-boards">
      <dash-base component="Dashboard1" dash-name="Dashboard 1" />
      <dash-base component="Dashboard2" dash-name="Dashboard 2" />
      <dash-base component="Dashboard3" dash-name="Dashboard 3" />
      <dash-base component="Dashboard4" dash-name="Dashboard 4" />
    </div>
  </div>
</template>
