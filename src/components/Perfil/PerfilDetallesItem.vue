<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import BaseButton from '../BaseButton.vue';
import type { IPersona } from '@/interfaces/persona/IPersona';
const baseUrl = import.meta.env.VITE_APP_URL_API_SOURCE
const isLoading = ref(true)

defineProps<{
  config:{
    persona: IPersona,
    isEditable: boolean
  }
}>();

onBeforeMount(async () => {
  isLoading.value = false;
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-xl mt-16">
    <h2 class="text-3xl font-semibold text-[var(--primary)] mb-6 text-center">Perfil {{ config.isEditable ? 'de Usuario' : 'del Intercambiador' }}</h2>

    <div class="flex flex-col items-center space-y-6">
      <div class="relative">
        <img
          v-if="config.persona.rutaFotoPerfil"
          :src="baseUrl + config.persona.rutaFotoPerfil"
          alt="Foto de Perfil"
          class="w-32 h-32 rounded-full object-cover border-4 border-[var(--primary)]"
        />
        <div v-else class="w-32 h-32 rounded-full bg-gray-300 border-4 border-[var(--primary)]"></div>
      </div>

      <div class="w-full space-y-4 text-gray-700">
        <div class="flex flex-col justify-between">
          <span class="font-medium">Nombre:</span>
          <p class="text-gray-600">{{ config.persona.nombre }}</p>
        </div>

        <div class="flex flex-col justify-between">
          <span class="font-medium">Biografía:</span>
          <p class="text-gray-600">{{ config.persona.biografia == "" ? "¡Cuéntanos más sobre ti! Agrega tu bio para que te conozcan mejor." : config.persona.biografia }}</p>
        </div>
      </div>

      <div class="mt-8 text-center w-full md:w-fit" v-if="config.isEditable">
        <router-link :to="{name: 'perfil editar'}">
          <BaseButton styleType="primary" class="px-8 py-3 bg-[var(--primary)] text-white text-lg font-semibold hover:bg-[var(--primary)] transition duration-300 ease-in-out">
            Editar Perfil
          </BaseButton>
        </router-link>
      </div>
    </div>
  </div>
</template>
