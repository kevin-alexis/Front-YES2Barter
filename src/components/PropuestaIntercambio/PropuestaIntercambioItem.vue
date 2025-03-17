<script setup lang="ts">
import type { IObjeto } from '@/interfaces/objeto/IObjeto'
const URL_API_SOURCE = import.meta.env.VITE_APP_URL_API_SOURCE

defineProps<{
  propuestaIntercambio: IObjeto
}>()
</script>
<template>
  <RouterLink :to="{name: 'consultar detalles objeto', params:{ id: propuestaIntercambio.id}}" class="w-fit!">
    <div class="flex flex-col w-35 text-center">
      <img :src="URL_API_SOURCE + propuestaIntercambio.rutaImagen" class="h-50 object-cover" />
      <div class="w-full">
        <p class="font-bold">{{ propuestaIntercambio.nombre }}</p>
        <p>{{ propuestaIntercambio.fechaPublicacion }}</p>
      </div>
    </div>
  </RouterLink>
</template>
