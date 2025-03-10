<script setup lang="ts">
import { nextTick, onMounted, watch, ref } from 'vue'
import MensajeItem from './MensajeItem.vue'

const mensajes: any = defineModel('mensajes')

const chatContainer = ref<HTMLElement | null>(null)

const hacerScroll = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}
onMounted(hacerScroll)

watch(mensajes, hacerScroll, { deep: true })
</script>

<template>
  <div ref="chatContainer" class="h-[calc(100vh-120px)] w-full overflow-auto p-4">
    <template v-if="mensajes.length > 0">
      <MensajeItem
        v-for="(mensaje, index) in mensajes"
        :mensaje="mensaje"
        :key="index"
        class="w-full"
      />
    </template>
    <div v-else class="flex flex-col justify-center items-center h-64 gap-2">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-light text-center">
        ¡Aún no hay mensajes!
      </h1>
      <h2 class="text-xl sm:text-2xl md:text-3xl font-light text-center">¿Por qué no empiezas la conversación con un <strong>"Hola"</strong>?</h2>
    </div>
  </div>
</template>
