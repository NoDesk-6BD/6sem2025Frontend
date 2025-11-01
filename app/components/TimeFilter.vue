// app/components/TimeFilter.vue
<template>
  <div class="flex items-center justify-end">
    <label class="mr-2">Período selecionado:</label>
    <UPopover popper="{ placement: 'bottom-end' }" @show="focusHiddenButton">
      <UButton
        class="bg-[#2082c5] hover:bg-[#1a6ba2] text-white"
        variant="solid"
        icon="i-lucide-calendar"
      >
        <template v-if="selectedLabel">
          {{ selectedLabel }}
        </template>
        <template v-else> Selecione o período </template>
      </UButton>
      <template #content>
        <button ref="hiddenBtn" class="sr-only" tabindex="0">
          Foco oculto
        </button>
        <div
          class="flex flex-row gap-2 px-2 py-3 min-w-[10vw] max-w-[200px] items-center"
        >
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
                value !== option.id
                  ? 'bg-white text-[#2082c6] border-transparent hover:bg-[#dcedf9] border-[#2082c6]'
                  : 'bg-[#2082c5] text-white border-[#2082c5] font-semibold hover:bg-[#2082c5]',
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
              :number-of-months="1"
              range
              class="custom-calendar"
              locale="pt-BR"
              @update:model-value="onCustomRange"
            />
            <UButton
              class="mt-2 w-full bg-[#2082c5] hover:bg-[#1a6ba2] text-white"
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
  { label: "Últimos 3 meses", id: "90", duration: { months: 3 } },
  { label: "Últimos 6 meses", id: "180", duration: { months: 6 } },
  { label: "Último ano", id: "365", duration: { years: 1 } },
];

const value = ref("");
const customRange = ref<{ start?: CalendarDate; end?: CalendarDate }>({});
const hiddenBtn = ref<HTMLButtonElement | null>(null);

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
  label: string;
  id: string;
  duration: { days?: number; months?: number; years?: number };
}) {
  value.value = option.id;
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
  if (range && range.start && range.end) {
    customRange.value = range;
    if (value.value !== "custom") {
      value.value = "custom";
    }
  }
}

function focusHiddenButton() {
  if (hiddenBtn.value) hiddenBtn.value.focus();
}

const emit = defineEmits<{
  (e: "updateRange", payload: { start_date: string; end_date: string }): void;
}>();

function apply() {
  if (customRange.value.start && customRange.value.end) {
    const start = formatAPIDate(customRange.value.start as CalendarDate);
    const end = formatAPIDate(customRange.value.end as CalendarDate);
    console.log("Enviando:", start, "-", end);

    emit("updateRange", { start_date: start, end_date: end });
  } else {
    console.log("Nenhum período selecionado");
  }
}

function formatAPIDate(date: CalendarDate) {
  const d = date.toDate(getLocalTimeZone());
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
</script>

<style scoped>
/* Nomes dos dias da semana */
:deep(.text-primary.text-xs) {
  color: #1e78b6 !important;
}

/* Dia atual */
:deep(.vc-day-today),
:deep([data-today]) {
  color: #3eaaf2 !important;
}

/* Hover dos dias do mês não selecionados */
:deep([role="button"]:not([data-selected]):hover) {
  background-color: #d1e0eb !important;
}

/* Background e hover dos dias selecionados */
:deep([data-selected]) {
  background-color: #1e78b6 !important;
  color: #fff !important;
}
:deep([data-selected]:hover) {
  background-color: #156090 !important;
}

/* Dias do range selecionado */
:deep([data-highlighted]:not([data-selected])) {
  background-color: #dcedf9 !important;
  color: #134e77 !important;
}

/* Força a cor dos botões em todos os estados */
:deep(button:focus) {
  background-color: #1e78b6 !important;
  border-color: #1e78b6 !important;
  color: #fff !important;
}
</style>
