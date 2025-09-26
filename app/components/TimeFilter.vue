<template>
  <div class="flex items-center justify-end">
    <label class="mr-2">Período selecionado:</label>
    <UPopover popper="{ placement: 'bottom-end' }">
      <UButton
        class="bg-[#1E78B6] hover:bg-[#2C89C9] text-white"
        variant="solid"
        icon="i-lucide-calendar"
      >
        <template v-if="selectedLabel">
          {{ selectedLabel }}
        </template>
        <template v-else> Selecione o período </template>
      </UButton>
      <template #content>
        <div class="flex flex-row gap-2 px-2 py-3 min-w-[400px] items-center">
          <!-- Botões rápidos centralizados na esquerda -->
          <div
            class="flex flex-col gap-1 px-3 justify-center items-center h-80 bg-white border-r border-[#E5E7EB]"
          >
            <UButton
              v-for="option in quickOptions"
              :key="option.id"
              size="sm"
              variant="ghost"
              :class="[
                'min-w-[140px] justify-center rounded-all text-base font-normal border transition-colors',
                value === option.id
                  ? 'bg-[#f2f8fd] text-[#1E78B6] border-[#1E78B6] font-semibold'
                  : 'bg-white text-[#1E78B6] border-transparent hover:bg-[#F1F5F9]',
              ]"
              @click="selectQuick(option)"
            >
              {{ option.label }}
            </UButton>
          </div>
          <!-- Calendário na direita -->
          <div>
            <UCalendar
              v-model="customRange"
              :number-of-months="2"
              range
              class="custom-calendar"
              locale="pt-BR"
              @update:model-value="onCustomRange"
            />
            <UButton
              class="mt-2 w-full bg-[#1E78B6] hover:bg-[#0F67A4] text-white"
              block
              @click="apply"
            >
              Aplicar
            </UButton>
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<script setup lang="ts">
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";
import { ref, computed } from "vue";

const quickOptions = [
  { label: "Últimos 7 dias", id: "7", duration: { days: 7 } },
  { label: "Últimos 14 dias", id: "14", duration: { days: 14 } },
  { label: "Últimos 30 dias", id: "30", duration: { days: 30 } },
  { label: "Últimos 3 meses", id: "3m", duration: { months: 3 } },
  { label: "Últimos 6 meses", id: "6m", duration: { months: 6 } },
  { label: "Último ano", id: "1y", duration: { years: 1 } },
];

const value = ref("7"); // default: últimos 7 dias
const customRange = ref<{ start?: CalendarDate; end?: CalendarDate }>({});

const df = new DateFormatter("pt-BR", { dateStyle: "medium" });

const selectedLabel = computed(() => {
  const quick = quickOptions.find((o) => o.id === value.value);
  if (quick) return quick.label;
  if (customRange.value.start && customRange.value.end) {
    return (
      df.format(customRange.value.start.toDate(getLocalTimeZone())) +
      " - " +
      df.format(customRange.value.end.toDate(getLocalTimeZone()))
    );
  }
  return "";
});

function selectQuick(option: {
  id: string;
  duration: { days?: number; months?: number; years?: number };
}) {
  value.value = option.id;
  // Calcula o range baseado na duração
  const now = new Date();
  const today = new CalendarDate(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );
  let start: CalendarDate;
  if (option.duration.days) {
    start = today.subtract({ days: option.duration.days - 1 });
  } else if (option.duration.months) {
    start = today.subtract({ months: option.duration.months }).add({ days: 1 });
  } else if (option.duration.years) {
    start = today.subtract({ years: option.duration.years }).add({ days: 1 });
  } else {
    start = today;
  }
  customRange.value = { start, end: today };
}

function onCustomRange(
  range: { start?: CalendarDate; end?: CalendarDate } | null,
) {
  value.value = "custom";
  if (range && range.start && range.end) {
    // If start/end are not CalendarDate, convert if needed
    customRange.value = {
      start: new CalendarDate(
        range.start.year,
        range.start.month,
        range.start.day,
      ),
      end: new CalendarDate(range.end.year, range.end.month, range.end.day),
    };
  } else {
    customRange.value = {};
  }
}

// Placeholder for apply button click
function apply() {
  // Emitir um evento
}
</script>

<style scoped>
.custom-calendar :deep(.vc-day-content) {
  background-color: transparent !important;
  color: #222 !important;
}
.custom-calendar :deep(.vc-day-content.vc-highlight) {
  background-color: #1e78b6 !important;
  color: #fff !important;
}
.custom-calendar :deep(.vc-day-content.vc-selected) {
  background-color: #005691 !important;
  color: #fff !important;
}
.custom-calendar :deep(.vc-day-content:hover) {
  background-color: #3b9adb !important;
  color: #fff !important;
}
.custom-calendar :deep(.vc-day-content.vc-disabled) {
  color: #cbd5e1 !important;
  background: transparent !important;
}
</style>
