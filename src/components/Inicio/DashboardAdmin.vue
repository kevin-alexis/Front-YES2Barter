<script setup lang="ts">
import { onMounted } from 'vue'
import { useObjetoStore } from '@/stores/objeto'
import { useAccountStore } from '@/stores/account'

const objetoStore = useObjetoStore()
const accountStore = useAccountStore()

onMounted(async () => {
  await objetoStore.getAll()
  await accountStore.getAll()
})

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5 m-10">
      <div
        class="flex flex-col justify-center items-center gap-5 bg-gradient-to-t from-[var(--primary)] to-[var(--primary-gradient)] h-60 p-10 rounded-2xl text-center"
      >
        <h1 class="text-4xl font-bold text-white">Administrar Categorías</h1>
        <RouterLink :to="{ name: 'administrar categorias' }">
          <button
            id="scrollButton2"
            @click="scrollToTop"
            class="cursor-pointer mt-5 px-8 py-3 bg-white text-[var(--primary)] rounded-full hover:bg-gray-100 transition duration-200"
          >
            Gestionar Categorias
          </button>
        </RouterLink>
      </div>

      <div
        class="flex flex-col justify-center items-center gap-5 bg-gradient-to-t from-[var(--primary)] to-[var(--primary-gradient)] h-60 p-10 rounded-2xl text-center"
      >
        <h1 class="text-4xl font-bold text-white">Administrar Usuarios</h1>
        <RouterLink :to="{ name: 'administrar usuarios' }">
          <button
            id="scrollButton3"
            @click="scrollToTop"
            class="cursor-pointer mt-5 px-8 py-3 bg-white text-[var(--primary)] rounded-full hover:bg-gray-100 transition duration-200"
          >
            Gestionar Usuarios
          </button>
        </RouterLink>
      </div>
    </div>

    <div
      class="flex flex-col justify-center items-center gap-5 bg-white h-full m-10 p-8 md:p-20 rounded-2xl"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full">
        <div
          class="bg-white p-5 rounded-2xl shadow-md text-center border border-gray-200 hover:shadow-lg transition-all duration-200"
        >
          <h3 class="font-bold text-2xl">Total de Cambios concretados</h3>
          <p class="text-4xl">12</p>
          <!-- CAMBIARLO POR CAMBIOS CONCRETADOS UNA VEZ ESTE ESE ENDPOINT -->
        </div>

        <div
          class="bg-white p-5 rounded-2xl shadow-md text-center border border-gray-200 hover:shadow-lg transition-all duration-200"
        >
          <h3 class="font-bold text-2xl">Total de Objetos</h3>
          <p class="text-4xl">{{ objetoStore.list.length }}</p>
        </div>

        <div
          class="bg-white p-5 rounded-2xl shadow-md text-center border border-gray-200 hover:shadow-lg transition-all duration-200"
        >
          <h3 class="font-bold text-2xl">Total de Usuarios</h3>
          <p class="text-4xl">{{ accountStore.list.length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
