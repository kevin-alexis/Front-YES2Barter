<script setup lang="ts">
import type { IMensajeVM } from '@/interfaces/mensaje/IMensaje'
import { useAccountStore } from '../../stores/account'
import { formatTimeToView } from '@/utils/helper'
import { ref } from 'vue'
const accountStore = useAccountStore()

const props = defineProps<{
  mensaje: IMensajeVM
}>()

const isEmisor = ref(
  props.mensaje.idUsuarioEmisor !=
    accountStore.user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
)
</script>
<template>
  <div :class="['flex text-black  mt-2 w-1/2', isEmisor ? 'justify-start' : 'justify-end']">
    <div :class="['flex w-fit rounded-xl px-2', isEmisor ? 'text-left bg-white' : 'text-end bg-[var(--primary)]']">
      <div :class="[' flex flex-col justify-between p-1', isEmisor ? 'items-start' : 'items-end']">
        <div class="w-fit">
          <!-- <span
            :class="[
              'font-bold w-full text-xs',
              isEmisor ? 'text-orange-600 w-fit' : 'text-blue-600 w-fit',
            ]"
            >{{ mensaje.personaEmisor.nombre }}</span
          > -->
          <p class="break-words whitespace-pre-wrap text-black w-fit font-normal text-sm">
            {{ mensaje.contenido }}
          </p>
        </div>
        <div class="w-fit self-end">
          <p class="text-end text-xs opacity-[40%]">{{ formatTimeToView(mensaje.fechaEnvio) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
