<script setup lang="ts">
import type { IGetChatsVM } from '@/interfaces/chat/IChat'
import { useAccountStore } from '@/stores/account'
import { ref, computed } from 'vue'
const baseUrl = import.meta.env.VITE_APP_URL_API_SOURCE

const accountStore = useAccountStore()
const prop = defineProps<{
  chat: IGetChatsVM
}>()

console.log('------')
console.log(prop.chat)

const isOfertante = computed(
  () => accountStore.user.idUsuario === prop.chat.propuestaIntercambio.idUsuarioOfertante,
)

const getProfileImage = (rutaFotoPerfil: string) => {
  if (!rutaFotoPerfil) return ''
  const rutaConvertida = rutaFotoPerfil.replace(/\\/g, '/')
  return `${baseUrl}${rutaConvertida}`
}

const getInitials = (name: string | undefined) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((word) => word[0]?.toUpperCase())
    .join('')
}
</script>

<template>
  <RouterLink :to="{ name: 'chat detalles', params: { id: prop.chat.id } }" class="block w-full">
    <div
      class="bg-white hover:bg-gray-50 cursor-pointer w-full flex items-center border-b border-gray-200 px-4 py-3"
    >
      <!-- Avatar del usuario -->
      <div
        class="h-12 w-12 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden mr-3"
      >
        <img
          v-if="prop.chat.personaReceptor.rutaFotoPerfil"
          :src="getProfileImage(prop.chat.personaReceptor.rutaFotoPerfil)"
          alt="Avatar"
          class="h-full w-full object-cover"
        />

        <span v-else class="text-white font-medium text-lg">
          {{ getInitials(prop.chat.personaReceptor.nombre) }}
        </span>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-baseline">
          <h3 class="font-medium text-black truncate">{{ prop.chat.personaReceptor.nombre }}</h3>
          <span class="text-xs text-gray-500 ml-2">22/03/2025</span>
        </div>

        <div class="flex justify-between items-start mt-1">
          <div class="flex-1">
            <p class="text-sm text-gray-600 truncate">
              <span class="font-medium">Producto Ofertado:</span>
              {{
                isOfertante
                  ? prop.chat.propuestaIntercambio.objetoOfertado.nombre
                  : prop.chat.propuestaIntercambio.objetoSolicitado.nombre
              }}
            </p>
            <p class="text-sm text-gray-600 truncate">
              <span class="font-medium">Producto Solicitado:</span>
              {{
                !isOfertante
                  ? prop.chat.propuestaIntercambio.objetoOfertado.nombre
                  : prop.chat.propuestaIntercambio.objetoSolicitado.nombre
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
