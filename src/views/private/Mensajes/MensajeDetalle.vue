<script setup lang="ts">
import { HubConnectionBuilder } from '@microsoft/signalr'
import { ref, onMounted, nextTick, onUnmounted, watch } from 'vue'
import { useAccountStore } from '../../../stores/account'
import BaseButton from '@/components/BaseButton.vue'
import MensajeList from '../../../components/Mensaje/MensajeList.vue'
import { useMensajeStore } from '@/stores/mensaje'
import { useRoute } from 'vue-router'
import { useChatStore } from '../../../stores/chat'

const baseUrl = import.meta.env.VITE_APP_URL_API_SOURCE
const accountStore = useAccountStore()
const mensajeStore = useMensajeStore()
const chatStore = useChatStore()

const route = useRoute()
const conexion = ref(null)
const nuevoMensaje = ref('')
const mensajeInput = ref<HTMLTextAreaElement | null>(null)

const id = ref('')
const idEmisor = ref('')

const conectarAlChat = (idChat: string) => {
  // Cerramos la conexión si existe
  if (conexion.value) {
    conexion.value.stop().catch((err) => console.log('Error al desconectar:', err))
  }

  // Hacemos una nueva conexión con SignalR
  conexion.value = new HubConnectionBuilder().withUrl(baseUrl + 'chathub').build()

  conexion.value.start().then(() => {
    conexion.value
      .invoke('ConectarAlChat', idChat)
      .catch((err) => console.log('Error al conectar al chat: ', err))

    // Mensajes recibidos y lo agregamos a la lista de mensajes que vienen de la bd
    conexion.value.on('RecibirMensaje', (mensaje, idEmisor) => {
      mensajeStore.list.push({
        contenido: mensaje,
        idUsuarioEmisor: idEmisor,
        fechaEnvio: new Date(),
      })
    })
  })
}

onMounted(() => {
  // ? NextTick: Ejecuta una función después de que el DOM haya sido actualizado - Esto lo use porque ocupo que los mensajes se hayan cargado bien para poder hacer el calculo correcto de la altura
  nextTick(() => ajustarAltura())

  accountStore.getUser()
  idEmisor.value = accountStore.user.idUsuario
  id.value = route.params.id as string
  mensajeStore.getAllByIdChat(parseInt(id.value))
  conectarAlChat(id.value)
})

const enviarMensaje = async () => {
  try {
    if (!nuevoMensaje.value.trim()) {
      return
    }
    await conexion.value.invoke('EnviarMensaje', id.value, nuevoMensaje.value, idEmisor.value)
    nuevoMensaje.value = ''
  } catch (err) {
    console.error('Error al enviar el mensaje', err)
  }
}

watch(
  () => route.params.id,
  (newId) => {
    if (newId !== id.value) {
      id.value = newId as string
      conectarAlChat(id.value)
      mensajeStore.getAllByIdChat(parseInt(id.value))
    }
  },
)

onUnmounted(() => {
  // Se cierra la conexión
  conexion.value?.stop().catch((err) => console.log('Error al desconectar:', err))
})

const ajustarAltura = () => {
  if (!mensajeInput.value) return
  mensajeInput.value.style.height = 'auto'
  mensajeInput.value.style.height = Math.min(mensajeInput.value.scrollHeight, 140) + 'px'
}

function cerrarChat(isSuccess: boolean) {
  chatStore.closeChat(isSuccess, parseInt(id.value))
}
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between p-2">
    <div class="flex gap-2">
      <BaseButton
        styleType="primary"
        class="text-white h-fit rounded-full"
        @click="cerrarChat(true)"
      >
        Intercambio Concretado
      </BaseButton>
      <BaseButton
        styleType="danger"
        class="text-white h-fit rounded-full"
        @click="cerrarChat(false)"
      >
        Intercambio No Concretado
      </BaseButton>
    </div>

    <div class="flex-1 overflow-y-auto">
      <MensajeList v-model:mensajes="mensajeStore.list" class="h-full"></MensajeList>
    </div>

    <div class="w-full flex gap-4 items-end">
      <textarea
        v-model="nuevoMensaje"
        placeholder="Escribe un mensaje..."
        class="w-full bg-white p-2 rounded-md border border-gray-300 resize-none overflow-y-auto leading-relaxed"
        rows="1"
        ref="mensajeInput"
        @input="ajustarAltura"
      ></textarea>

      <div class="w-fit">
        <BaseButton
          styleType="primary"
          class="text-white h-fit rounded-full"
          @click="enviarMensaje"
        >
          <i class="pi pi-send"></i>
        </BaseButton>
      </div>
    </div>
  </div>
</template>
