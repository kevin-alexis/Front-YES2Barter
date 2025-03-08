<script setup lang="ts">
import type { IObjeto } from '@/interfaces/objeto/IObjeto'
const URL_API_SOURCE = import.meta.env.VITE_APP_URL_API_SOURCE

defineProps<{
  objeto: IObjeto
}>()
</script>
<template>
  <!-- RECIBIR LA CONFIG Y PARA PODER AGREGAR O NO EL EDITAR ELIMINAR
  SEGUN LA CONFIG-->
  <RouterLink :to="{name: 'consultar detalles objeto', params:{ id: objeto.id}}" class="w-fit!">
    <div class="flex flex-col w-35 text-center">
      <img :src="URL_API_SOURCE + objeto.rutaImagen" class="h-50 object-cover" />
      <div class="w-full">
        <p class="font-bold">{{ objeto.titulo }}</p>
        <p>{{ objeto.fechaPublicacion }}</p>
      </div>
    </div>
  </RouterLink>
</template>
