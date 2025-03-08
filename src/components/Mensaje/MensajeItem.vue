<script setup lang="ts">
import type { IMensaje } from '@/interfaces/mensaje/IMensaje'

defineProps<{
  mensaje: IMensaje
}>()
</script>
<template>
  <RouterLink
    :to="{ name: 'consultar detalles objeto', params: { id: mensaje.id } }"
    class="w-fit!"
  >
    <div class="flex flex-col w-35 text-center">
      <div class="w-full">
        <p class="font-bold">{{ mensaje.contenido }}</p>
        <p>{{ mensaje.fechaEnvio }}</p>
      </div>
    </div>
  </RouterLink>
</template>
