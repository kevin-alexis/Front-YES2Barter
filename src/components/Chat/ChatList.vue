<script setup lang="ts">
import ChatItem from './ChatItem.vue'

const chats: any = defineModel('chats')
</script>

<template>
  <div class="h-full w-full">
    <div
      v-if="chats.length > 0"
      class="w-full py-2"
    >
      <ChatItem v-for="(chat, index) in chats" :chat="chat" :key="index" class="w-full" />
    </div>
    <div v-else class="flex justify-center items-center h-64">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-light text-center">
        Aún no tienes chats. ¡Empieza a hacer ofertas para conectar con otros y recibir respuestas!
      </h1>
    </div>
  </div>
</template>
