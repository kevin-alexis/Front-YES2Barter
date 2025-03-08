<script setup lang="ts">
import MensajeItem from './MensajeItem.vue'

const mensajes: any = defineModel('mensajes')
</script>

<template>
  <div class="h-full w-full">
    <div
      v-if="mensajes.length > 0"
      class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-1"
    >
      <MensajeItem
        v-for="(mensajes, index) in mensajes"
        :objeto="mensaje"
        :key="index"
        class="w-full"
      />
    </div>
    <div v-else class="flex justify-center items-center h-64">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-light text-center">
        No hay coincidencias...
      </h1>
    </div>
  </div>
</template>
