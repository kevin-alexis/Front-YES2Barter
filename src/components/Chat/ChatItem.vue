<script setup lang="ts">
import type { IGetChatsVM } from '@/interfaces/chat/IChat'
import { useAccountStore } from '@/stores/account';
import { ref } from 'vue';

const accountStore = useAccountStore()
const prop = defineProps<{
  chat: IGetChatsVM
}>()

const isOfertante = ref(accountStore.user.idUsuario == prop.chat.propuestaIntercambio.objetoOfertado.idUsuario)

defineEmits<{
  (e: 'selectChat'): void
}>()

</script>

<template>
  <RouterLink
    @click="$emit('selectChat')"
    :to="{ name: 'chat detalles', params: { id: prop.chat.id } }"
    class="block w-full"
  >
    <div
      class="bg-white text-black rounded-xl w-full p-4 flex gap-4 shadow-md hover:shadow-lg transition-all duration-200 border-b border-gray-300"
    >
      <div class="flex flex-col justify-center flex-1">
        <span class="font-semibold text-black text-base">{{ prop.chat.personaReceptor.nombre }}</span>
        <p class="text-gray-600 text-sm line-clamp-2">
          <strong>Producto Ofertado: </strong> {{ isOfertante ? prop.chat.propuestaIntercambio.objetoOfertado.nombre :  prop.chat.propuestaIntercambio.objetoSolicitado.nombre}} </p>
          <p class="text-gray-600 text-sm line-clamp-2">
            <strong>Producto Solicitado: </strong> {{ !isOfertante ? prop.chat.propuestaIntercambio.objetoOfertado.nombre :  prop.chat.propuestaIntercambio.objetoSolicitado.nombre}} </p>
      </div>
    </div>
  </RouterLink>
</template>
