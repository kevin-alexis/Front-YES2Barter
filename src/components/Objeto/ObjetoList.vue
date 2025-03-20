<script setup lang="ts">
import type { IObjeto } from '@/interfaces/objeto/IObjeto';
import ObjetoItem from './ObjetoItem.vue'

// const objetos: any = defineModel('objetos')

defineProps<{
  objetos: IObjeto[]
  config:{
    showButtons: boolean
  }
}>()

</script>

<template>
  <div class="h-full w-full">
    <div v-if="objetos.length > 0" class="grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      <ObjetoItem
        v-for="(objeto, index) in objetos"
        :config="{
          objeto: objeto,
          showButtons: config.showButtons
        }"
        :key="index"
        class="w-full min-w-0"
      />
    </div>
    <div v-else class="flex justify-center items-center h-64">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-light text-center">
        ¡Ups! Aún no tienes objetos. Empieza a crear y administrar tus objetos aquí.
      </h1>
    </div>
  </div>
</template>
