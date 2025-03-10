<script setup lang="ts">
import type { IGetChatsVM } from '@/interfaces/chat/IChat'

defineProps<{
  chat: IGetChatsVM
}>()
</script>

<template>
  <RouterLink
    :to="{ name: 'chat detalles', params: { id: chat.id } }"
    class="block w-full"
  >
    <div
      class="bg-white text-black rounded-xl mt-5 w-full p-4 flex gap-4 shadow-md hover:shadow-lg transition-all duration-200 border-b border-gray-300"
    >
      <div class="flex flex-col justify-center flex-1">
        <span class="font-semibold text-black text-base">{{ chat.personaReceptor.nombre }}</span>
        <p class="text-gray-600 text-sm line-clamp-2">
          {{ chat.personaReceptor.biografia }}
        </p>
      </div>
    </div>
  </RouterLink>
</template>
