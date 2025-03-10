<script setup lang="ts">
import LogChart from '@/components/Log/LogChart.vue'
import LogTable from '@/components/Log/LogTable.vue'
import { useLogStore } from '@/stores/log'
import { onMounted } from 'vue'

const logStore = useLogStore()

onMounted(() => {
  logStore.getAll()
})
</script>

<template>
  <div class="h-screen p-4">
    <h1 class="text-2xl font-bold text-center mb-4">Log Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white shadow-lg rounded-xl p-4">
        <h2
          class="text-3xl font-bold text-center mb-4 border-b-2 text-[var(--primary)] border-[var(--primary)] pb-2"
        >
          Información de los logs
        </h2>
        <LogTable v-model:logs="logStore.list" />
      </div>

      <div class="bg-white shadow-lg rounded-xl p-4">
        <h2
          class="text-3xl font-bold text-center mb-4 border-b-2 text-[var(--primary)] border-[var(--primary)] pb-2"
        >
          Estadísticas de los Logs
        </h2>
        <LogChart v-model:logs="logStore.list" />
      </div>
    </div>
  </div>
</template>
