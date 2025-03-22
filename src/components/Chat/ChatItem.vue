<script setup lang="ts">
import type { IGetChatsVM } from '@/interfaces/chat/IChat'
import { useAccountStore } from '@/stores/account'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const baseUrl = import.meta.env.VITE_APP_URL_API_SOURCE

const accountStore = useAccountStore()
const prop = defineProps<{
  chat: IGetChatsVM
}>()

defineEmits<{
  (e: 'selectChat'): void
}>()

const isOfertante = computed(
  () => accountStore?.user?.idUsuario === prop.chat.propuestaIntercambio.idUsuarioOfertante,
)

const route = useRoute()

const isSeleccionado = computed(() => route.params.id === String(prop.chat.id))


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
  <RouterLink
    @click="$emit('selectChat')"
    :to="{ name: 'chat detalles', params: { id: prop.chat.id } }"
    class="block w-full"
  >
    <div
      :class="[' text-black w-full p-4 flex gap-4 hover:shadow-lg transition-all duration-200 border-b border-gray-300',
      isSeleccionado ? 'bg-[var(--primary)]': 'bg-white']"
    >
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
          <h3 :class="['font-medium truncate', isSeleccionado ? 'text-[#3b5e24]' : 'text-black']">{{ prop.chat.personaReceptor.nombre }}</h3>
          <span :class="['text-xs ml-2', isSeleccionado ? 'text-white' : 'text-gray-500']">22/03/2025</span>
        </div>

        <div class="flex justify-between items-start mt-1">
          <div class="flex-1">
            <p :class="['text-sm  truncate', isSeleccionado ? 'text-white':'text-gray-600']">
              <span class="font-medium">Producto Ofertado:</span>
              {{
                isOfertante
                  ? prop.chat.propuestaIntercambio.objetoOfertado.nombre
                  : prop.chat.propuestaIntercambio.objetoSolicitado.nombre
              }}
            </p>
            <p :class="['text-sm  truncate', isSeleccionado ? 'text-white':'text-gray-600']">
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
