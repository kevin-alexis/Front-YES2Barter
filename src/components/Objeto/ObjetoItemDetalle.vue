<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useObjetoStore } from '@/stores/objeto'
import { usePersonaStore } from '@/stores/persona'
import { useCategoriaStore } from '@/stores/categoria'
import { formatDateToView } from '@/utils/helper'
import type { IObjeto } from '@/interfaces/objeto/IObjeto'
import Image from 'primevue/image'
import Tag from 'primevue/tag'
import { usePropuestaIntercambioStore } from '@/stores/propuestaIntercambio'

const baseUrl = import.meta.env.VITE_APP_URL_API_SOURCE
const route = useRoute()

const objetoStore = useObjetoStore()
const personaStore = usePersonaStore()
const categoriaStore = useCategoriaStore()

const objeto = ref<IObjeto | null>(null)

const categoriasObjeto = computed(() => {
  return objeto.value ? categoriaStore.list.filter(item => item.id === objeto.value?.idCategoria) : []
})

onBeforeMount(async () => {
  const id = route.params.id as string
  try {
    const [objetoData, categorias] = await Promise.all([
      objetoStore.getById(id),
      categoriaStore.getAll()
    ])

    objeto.value = objetoData
    await personaStore.getPersonaByIdUsuario(objetoData.idUsuario)
  } catch (error) {
    console.error('Error al cargar datos:', error)
  }
})
</script>

<template>
  <div class="bg-white h-full">
    <div class="flex flex-col md:flex-row w-full rounded-lg overflow-hidden transform transition-all duration-300">

      <div class="w-full md:w-1/2">
        <Image
          v-if="objeto?.rutaImagen"
          :src="baseUrl + objeto.rutaImagen"
          class="w-full h-full object-cover transition-all duration-300 hover:scale-105 image-object-detail"
          alt="Imagen del objeto"
          preview
        />
      </div>

      <div class="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-4">
        <div v-if="objeto">
          <h2 class="font-bold text-3xl text-gray-800">{{ objeto.nombre }}</h2>
          <p class="text-gray-600 mt-2">{{ objeto.descripcion }}</p>

          <div class="flex flex-wrap gap-2 mt-3">
            <Tag
              v-for="(categoria, index) in categoriasObjeto"
              :key="index"
              class="text-sm font-semibold"
              :value="categoria.nombre"
              severity="info"
            />
          </div>
        </div>

        <p v-if="objeto?.fechaPublicacion" class="text-sm text-gray-500 italic border-l-4 border-blue-500 pl-3">
          Publicado el {{ formatDateToView(objeto.fechaPublicacion) }}
        </p>
      </div>

    </div>
  </div>
</template>
