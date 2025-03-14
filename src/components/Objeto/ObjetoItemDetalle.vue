<script setup lang="ts">
const baseUrl = import.meta.env.VITE_APP_URL_API_SOURCE
import { useRoute } from 'vue-router'
import { useAccountStore } from '@/stores/account'
import { usePersonaStore } from '@/stores/persona';
import { onBeforeMount, reactive } from 'vue';
import { useObjetoStore } from '@/stores/objeto';
import type { IObjeto } from '@/interfaces/objeto/IObjeto';
import { formatDateToView } from '@/utils/helper';
import Image from 'primevue/image';

const route = useRoute()
const objetoStore = useObjetoStore()
const accountStore = useAccountStore()
const personaStore = usePersonaStore()

const objeto = reactive<IObjeto>({});

onBeforeMount(async () => {
  const id = route.params.id as string;
  const response = await objetoStore.getById(id);
  await accountStore.getUser();
  await personaStore.getPersonaByIdUsuario(response.idUsuario);
  Object.assign(objeto, response);
})
</script>

<template>
    <div class="flex flex-col w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <Image :src="baseUrl + objeto.rutaImagen"
           class="h-72 w-full object-cover transition-transform duration-300 hover:scale-105"
           alt="Imagen del objeto" preview/>

      <div class="p-6 flex flex-col justify-between h-full">
        <p class="font-semibold text-2xl text-gray-800 truncate">{{ objeto.nombre }}</p>

        <p class="font-normal text-xl text-gray-700 mt-2">{{ objeto.descripcion }}</p>

        <p class="text-sm text-gray-500 mt-2">{{ formatDateToView(objeto.fechaPublicacion) }}</p>
      </div>
    </div>
</template>
