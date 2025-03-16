<script setup lang="ts">
import PropuestaIntercambioItem from './PropuestaIntercambioItem.vue'
const propuestasIntercambios: any = defineModel('propuestasIntercambios')

defineProps<{
  isInteractive: boolean
}>()
</script>

<template>
  <div class="h-full w-full p-5">
    <div

      v-if="propuestasIntercambios.length > 0"
      class="flex flex-col"
    >
      <PropuestaIntercambioItem
        v-for="(propuestaIntercambio, index) in propuestasIntercambios"
        :propuestaIntercambio="propuestaIntercambio"
        :isInteractive="isInteractive"
        :key="index"
        class="w-full"
      />
    </div>
    <div v-else class="flex justify-center items-center h-64">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-light text-center">No hay propuestas...</h1>
    </div>
  </div>
</template>
