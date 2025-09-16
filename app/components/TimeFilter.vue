<template>
  <div
    style="
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1rem;
    "
  >
    <label>Período de tempo:</label>
    <USelect v-model="value" value-key="id" :items="items" class="w-38" />
    <UPopover :disabled="value !== 'optionE'">
      <UButton
        :disabled="value !== 'optionE'"
        color="neutral"
        variant="subtle"
        icon="i-lucide-calendar"
      >
        <template v-if="modelValue.start">
          <template v-if="modelValue.end">
            {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }} -
            {{ df.format(modelValue.end.toDate(getLocalTimeZone())) }}
          </template>

          <template v-else>
            {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }}
          </template>
        </template>
        <template v-else> Pick a date </template>
      </UButton>

      <template #content>
        <UCalendar
          v-model="modelValue"
          class="p-2"
          :number-of-months="2"
          range
        />
      </template>
    </UPopover>

    <UButton class="col-span-2 col-start-1" color="neutral">Aplicar</UButton>
  </div>
</template>

<script lang="ts" setup>
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";
import { ref, shallowRef } from "vue";

const items = ref([
  {
    label: "Ultimos 7 dias",
    id: "optionA",
  },
  {
    label: "Ultimos 30 dias",
    id: "optionB",
  },
  {
    label: "Ultimos 60 dias",
    id: "optionC",
  },
  {
    label: "Ultimos 90 dias",
    id: "optionD",
  },
  {
    label: "Personalizado",
    id: "optionE",
  },
]);

const value = ref("optionA");

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});

const modelValue = shallowRef({
  start: new CalendarDate(2022, 1, 20),
  end: new CalendarDate(2022, 2, 10),
});
</script>

<style></style>
