<script setup lang="ts">
import type { ILog } from '@/interfaces/log/ILog';
import Chart from 'primevue/chart';
import { ref, onMounted, watch } from "vue";

const logs = defineModel<ILog[]>('logs');
const chartData = ref();
const chartOptions = ref();
const meses = ref([
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]);

const splitData = () => {
  const logsContadorPorMes = {
    criticalFrontEnd: Array(12).fill(0),
    criticalBackEnd: Array(12).fill(0),
    errorFrontEnd: Array(12).fill(0),
    errorBackEnd: Array(12).fill(0),
    warningFrontEnd: Array(12).fill(0),
    warningBackEnd: Array(12).fill(0),
    infoFrontEnd: Array(12).fill(0),
    infoBackEnd: Array(12).fill(0),
    totalFrontEnd: Array(12).fill(0),
    totalBackEnd: Array(12).fill(0)
  };

  logs.value?.forEach((log: ILog) => {
    const logFecha = new Date(log.fecha);
    const mesIndex = logFecha.getMonth();
    const isFrontEnd = log.fuente?.toLowerCase().includes("front-end");
    const isBackEnd = log.fuente?.toLowerCase().includes("back-end");

    if (log.nivel == 'Critical') {
      if (isFrontEnd) {
        logsContadorPorMes.criticalFrontEnd[mesIndex]++;
      } else if (isBackEnd) {
        logsContadorPorMes.criticalBackEnd[mesIndex]++;
      }
    } else if (log.nivel == 'Error') {
      if (isFrontEnd) {
        logsContadorPorMes.errorFrontEnd[mesIndex]++;
      } else if (isBackEnd) {
        logsContadorPorMes.errorBackEnd[mesIndex]++;
      }
    } else if (log.nivel == 'Warning') {
      if (isFrontEnd) {
        logsContadorPorMes.warningFrontEnd[mesIndex]++;
      } else if (isBackEnd) {
        logsContadorPorMes.warningBackEnd[mesIndex]++;
      }
    } else if (log.nivel == 'Info') {
      if (isFrontEnd) {
        logsContadorPorMes.infoFrontEnd[mesIndex]++;
      } else if (isBackEnd) {
        logsContadorPorMes.infoBackEnd[mesIndex]++;
      }
    }

    if (isFrontEnd) {
      logsContadorPorMes.totalFrontEnd[mesIndex]++;
    } else if (isBackEnd) {
      logsContadorPorMes.totalBackEnd[mesIndex]++;
    }
  });

  return logsContadorPorMes;
};

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const logCounts = splitData();

  return {
    labels: meses.value,
    datasets: [
      {
        type: 'line',
        label: 'Errores Críticos por mes Front End',
        borderColor: documentStyle.getPropertyValue('--p-red-500'),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: logCounts.criticalFrontEnd
      },
      {
        type: 'line',
        label: 'Errores Críticos por mes Back End',
        borderColor: documentStyle.getPropertyValue('--p-red-500'),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: logCounts.criticalBackEnd
      },
      {
        type: 'line',
        label: 'Errores por mes Front End',
        borderColor: documentStyle.getPropertyValue('--p-orange-500'),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: logCounts.errorFrontEnd
      },
      {
        type: 'line',
        label: 'Errores por mes Back End',
        borderColor: documentStyle.getPropertyValue('--p-orange-500'),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: logCounts.errorBackEnd
      },
      {
        type: 'line',
        label: 'Advertencias por mes Front End',
        borderColor: documentStyle.getPropertyValue('--p-yellow-500'),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: logCounts.warningFrontEnd
      },
      {
        type: 'line',
        label: 'Advertencias por mes Back End',
        borderColor: documentStyle.getPropertyValue('--p-yellow-500'),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: logCounts.warningBackEnd
      },
      {
        type: 'line',
        label: 'Información por mes Front End',
        borderColor: documentStyle.getPropertyValue('--p-blue-500'),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: logCounts.infoFrontEnd
      },
      {
        type: 'line',
        label: 'Información por mes Back End',
        borderColor: documentStyle.getPropertyValue('--p-blue-500'),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: logCounts.infoBackEnd
      },
      {
        type: 'bar',
        label: 'Total de Logs por mes Front End',
        backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
        data: logCounts.totalFrontEnd,
        borderColor: 'white',
        borderWidth: 2
      },
      {
        type: 'bar',
        label: 'Total de Logs por mes Back End',
        backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
        data: logCounts.totalBackEnd,
        borderColor: 'white',
        borderWidth: 2
      }
    ]
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const color = documentStyle.getPropertyValue('--p-text-color');
  const colorSecundario = documentStyle.getPropertyValue('--p-text-muted-color');
  const borde = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: color
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: colorSecundario
        },
        grid: {
          color: borde
        }
      },
      y: {
        ticks: {
          color: colorSecundario
        },
        grid: {
          color: borde
        }
      }
    }
  };
};

onMounted(() => {
  chartOptions.value = setChartOptions();
});

watch(logs, (newLogs) => {
  if (newLogs?.length) {
    chartData.value = setChartData();
  }
}, { deep: true, immediate: true });
</script>

<template>
  <div class="card">
      <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
  </div>
</template>
