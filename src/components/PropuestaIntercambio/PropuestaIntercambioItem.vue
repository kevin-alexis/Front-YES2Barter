<script setup lang="ts">
import { formatDateToView } from '../../utils/helper';
const URL_API_SOURCE = import.meta.env.VITE_APP_URL_API_SOURCE

defineProps<{
  propuestaIntercambio: any
}>()
</script>

<template>
  <div class="flex items-center bg-white p-4 rounded-lg shadow-md w-full max-w-4xl mx-auto mb-4 hover:shadow-xl transition-shadow duration-300">

    <RouterLink :to="{ name: 'consultar detalles objeto', params: { id: propuestaIntercambio.objetoOfertado.id } }" class="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden mr-4">
      <img :src="URL_API_SOURCE + propuestaIntercambio.objetoOfertado.rutaImagen" class="w-full h-full object-cover" />
    </RouterLink>

    <div class="flex-1">
      <p class="font-semibold text-lg text-gray-800">{{ propuestaIntercambio.objetoOfertado.nombre }}</p>
      <p class="text-sm text-gray-600">{{ formatDateToView(propuestaIntercambio.objetoOfertado.fechaPublicacion) }}</p>
    </div>

    <div class="flex items-center ml-4">
      <img :src="URL_API_SOURCE + propuestaIntercambio.personaOfertante.rutaFotoPerfil" alt="Foto de perfil ofertante" class="h-10 w-10 rounded-full border-2 border-gray-300 shadow-sm"/>
      <div class="ml-2">
        <p class="font-medium text-gray-800">Ofertante:</p>
        <p class="text-sm text-gray-600">{{ propuestaIntercambio.personaOfertante.nombre }}</p>
      </div>
    </div>

    <div class="flex items-center ml-4">
      <img :src="URL_API_SOURCE + propuestaIntercambio.personaReceptor.rutaFotoPerfil" alt="Foto de perfil receptor" class="h-10 w-10 rounded-full border-2 border-gray-300 shadow-sm"/>
      <div class="ml-2">
        <p class="font-medium text-gray-800">Receptor:</p>
        <p class="text-sm text-gray-600">{{ propuestaIntercambio.personaReceptor.nombre }}</p>
      </div>
    </div>

  </div>
</template>
