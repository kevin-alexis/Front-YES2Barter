<script setup lang="ts">
import type { IObjeto } from '@/interfaces/objeto/IObjeto'
import BaseButton from '@/components/BaseButton.vue'
import { useObjetoStore } from '@/stores/objeto'
import { formatDateToView } from '@/utils/helper'
import Button from 'primevue/button';
const objetoStore = useObjetoStore()
const baseUrl = import.meta.env.VITE_APP_URL_API_SOURCE

defineProps<{
  config: {
    objeto: IObjeto
    showButtons: boolean
  }
}>()

function eliminar(id: number) {
  objetoStore.deleteItem(id)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <RouterLink
      :to="{ name: 'consultar detalles objeto', params: { id: config.objeto.id } }"
      class="w-fit"
    >
      <img
        alt="Imagen del objeto"
        :src="baseUrl + config.objeto.rutaImagen"
        class="w-full h-40 object-cover rounded-t-md"
      />
      <div class="p-4">
        <h2 class="text-xl font-semibold text-gray-800">{{ config.objeto.nombre }}</h2>
        <p class="text-sm text-gray-700 truncate mt-2">{{ config.objeto.descripcion }}</p>
        <p class="text-xs text-gray-500">
          <strong>Fecha de publicación: </strong
          >{{ formatDateToView(config.objeto.fechaPublicacion) }}
        </p>
      </div>
    </RouterLink>

    <div v-if="config.showButtons" class="flex gap-2 mt-4 p-2 justify-center">
      <div class="flex gap-4">
        <RouterLink :to="{ name: 'editar objeto', params: { id: config.objeto.id } }" class="w-full">
          <Button icon="pi pi-pen-to-square" severity="success" rounded v-tooltip.top="{value: 'Editar', showDelay: 100, hideDelay: 300}" variant="outlined" aria-label="Edit" />
        </RouterLink>
        <div class="w-full flex justify-end">
          <Button icon="pi pi-trash" severity="danger" rounded v-tooltip.top="{value: 'Eliminar', showDelay: 100, hideDelay: 300}" variant="outlined" aria-label="Delete" @click="eliminar(config.objeto.id)" class="text-lg p-4 h-12" />
        </div>
      </div>
    </div>
  </div>
</template>
