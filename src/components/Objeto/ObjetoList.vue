<script setup lang="ts">
import ObjetoItem from './ObjetoItem.vue'

const objetos: any = defineModel('objetos')
</script>

<!-- HAY QUE METERLE VARIABLLES DE ESTILOS COMO BASEBUTTON PARA QUE SOLO LE PASEMOS
UN DATO Y SE REUTILICE ESTO EN DIFERENTES VISTAS Y NO HACER MAS, mandar config a objeto item -->

<template>
  <div class="h-full w-full">
    <div
      v-if="objetos.length > 0"
      class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-1"
    >
      <ObjetoItem v-for="(objeto, index) in objetos" :objeto="objeto" :key="index" class="w-full" />
    </div>
    <div v-else class="flex justify-center items-center h-64">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-light text-center">
        No hay coincidencias...
      </h1>
    </div>
  </div>
</template>
