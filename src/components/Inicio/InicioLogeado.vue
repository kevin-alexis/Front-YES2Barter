<script setup lang="ts">
import ObjetoList from '@/components/Objeto/ObjetoList.vue'
import { onMounted } from 'vue'
import { useObjetoStore } from '@/stores/objeto'
import { EstatusObjeto } from '@/common/enums/enums'

const objetoStore = useObjetoStore()

onMounted(async () => {
  await objetoStore.getAllByIdEstatus(EstatusObjeto.DISPONIBLE)
  objetoStore.list = objetoStore.list
    .sort((a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime())
    .slice(0, 6)
})
</script>

<template>
  <div>
    <div
      class="flex flex-col justify-center items-center gap-6 bg-gradient-to-t from-[var(--primary)] to-[var(--primary-gradient)] p-12 rounded-2xl text-center shadow-lg"
    >
      <h1 class="text-white font-bold text-3xl md:text-4xl lg:text-5xl">
        ¡Bienvenido a YES2Barter!
      </h1>
      <p class="text-white font-light w-full md:w-3/4 lg:w-2/3 text-sm md:text-lg lg:text-xl">
        Un lugar donde puedes intercambiar objetos en buen estado, reducir el consumismo y ayudar a
        reutilizar lo que otros ya no necesitan. ¡Únete a la comunidad que está cambiando el mundo!
      </p>
    </div>

    <div class="flex flex-col gap-8 mt-10">

      <div class="bg-white p-8 rounded-2xl shadow-lg">
        <h2 class="text-center md:text-start font-bold text-xl text-[var(--primary)] mb-6">
        Recientes
      </h2>
        <ObjetoList v-model:objetos="objetoStore.list"
        :config="{
          showButtons: false,
          message: '¡Ups! Aun no hay objetos.'

        }"
        />
      </div>
    </div>
  </div>
</template>
