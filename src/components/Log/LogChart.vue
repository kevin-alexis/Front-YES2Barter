<script setup lang="ts">
import type { ILog } from '@/interfaces/log/ILog';
import Chart from 'primevue/chart';
import { ref, onMounted, watch } from "vue";

const logs = defineModel<ILog[]>('logs');
const chartData = ref();
const chartOptions = ref();
const months = ref([
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]);

const splitData = () => {
  const logCountsByMonth = {
    critical: Array(12).fill(0),
    error: Array(12).fill(0),
    warning: Array(12).fill(0),
    info: Array(12).fill(0),
    total: Array(12).fill(0)
  };

  logs.value?.forEach((log: ILog) => {
    const logDate = new Date(log.fecha);
    const monthIndex = logDate.getMonth();

    if (log.nivel === 'Critical') {
      logCountsByMonth.critical[monthIndex]++;
    } else if (log.nivel === 'Error') {
      logCountsByMonth.error[monthIndex]++;
    } else if (log.nivel === 'Warning') {
      logCountsByMonth.warning[monthIndex]++;
    } else if (log.nivel === 'Info') {
      logCountsByMonth.info[monthIndex]++;
    }

    logCountsByMonth.total[monthIndex]++;
  });

  return logCountsByMonth;
};

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const logCounts = splitData();

  return {
    labels: months.value,
    datasets: [
      {
        type: 'line',
        label: 'Errores Críticos por mes',
        borderColor: documentStyle.getPropertyValue('--p-red-500'),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: logCounts.critical
      },
      {
        type: 'line',
        label: 'Errores por mes',
        borderColor: documentStyle.getPropertyValue('--p-orange-500'),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: logCounts.error
      },
      {
        type: 'line',
        label: 'Advertencias por mes',
        borderColor: documentStyle.getPropertyValue('--p-yellow-500'),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: logCounts.warning
      },
      {
        type: 'line',
        label: 'Información por mes',
        borderColor: documentStyle.getPropertyValue('--p-blue-500'),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: logCounts.info
      },
      {
        type: 'bar',
        label: 'Total de Logs por mes',
        backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
        data: logCounts.total,
        borderColor: 'white',
        borderWidth: 2
      }
    ]
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
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
