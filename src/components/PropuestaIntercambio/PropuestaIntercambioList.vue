<script setup lang="ts">
import PropuestaIntercambioItem from './PropuestaIntercambioItem.vue'

const propuestasIntercambios: any = defineModel('propuestasIntercambios')
</script>

<template>
  <div class="h-full w-full">
    <div
      v-if="propuestasIntercambios.length > 0"
      class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-1"
    >
      <PropuestaIntercambioItem
        v-for="(propuestaIntercambio, index) in propuestasIntercambios"
        :objeto="propuestaIntercambio"
        :key="index"
        class="w-full"
      />
    </div>
    <div v-else class="flex justify-center items-center h-64">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-light text-center">No hay propuestas...</h1>
    </div>
  </div>
</template>
