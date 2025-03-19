<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import BaseButton from '../BaseButton.vue';
import type { IPersona } from '@/interfaces/persona/IPersona';
import 'primeicons/primeicons.css';
import { usePersonaStore } from '@/stores/persona';

const baseUrl = import.meta.env.VITE_APP_URL_API_SOURCE;
const isLoading = ref(true);
const personaStore = usePersonaStore()
const photoFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const props = defineProps<{
  config:{
    persona: IPersona,
    isEditable: boolean
  }
}>();

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    photoFile.value = input.files[0];
    const formData = new FormData();
    formData.append('fotoPerfil', photoFile.value);
    personaStore.updateFotoPersona(props.config.persona.id, formData)
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

onBeforeMount(async () => {
  isLoading.value = false;
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-xl mt-16">
    <h2 class="text-3xl font-semibold text-[var(--primary)] mb-6 text-center">
      Perfil {{ props.config.isEditable ? 'de Usuario' : 'del Intercambiador' }}
    </h2>

    <div class="flex flex-col items-center space-y-6">
      <div class="relative">
        <img
          v-if="props.config.persona.rutaFotoPerfil"
          :src="baseUrl + props.config.persona.rutaFotoPerfil"
          alt="Foto de Perfil"
          class="w-32 h-32 rounded-full object-cover border-4 border-[var(--primary)]"
        />
        <div v-else class="w-32 h-32 rounded-full bg-gray-300 border-4 border-[var(--primary)]"></div>

        <button
          v-if="props.config.isEditable"
          @click="triggerFileInput"
          class="cursor-pointer absolute bottom-0 right-0 bg-[var(--primary)] p-2 rounded-full border-2 border-[var(--primary)] shadow-md hover:bg-[var(--primary)] hover:border-[var(--primary)] w-8 h-8 flex items-center justify-center"
          >
          <i class="pi pi-camera text-white text-lg"></i>
        </button>
        <input
          type="file"
          ref="fileInput"
          @change="handleFileChange"
          accept="image/*"
          class="hidden"
        />
      </div>

      <div class="w-full space-y-4 text-gray-700">
        <div class="flex flex-col justify-between">
          <span class="font-medium">Nombre:</span>
          <p class="text-gray-600">{{ props.config.persona.nombre }}</p>
        </div>

        <div class="flex flex-col justify-between">
          <span class="font-medium">Biografía:</span>
          <p v-if="props.config.isEditable" class="text-gray-600">{{ props.config.persona.biografia == "" ? "¡Cuéntanos más sobre ti! Agrega tu bio para que te conozcan mejor." : props.config.persona.biografia }}</p>
          <p v-else :class="['text-gray-600']">{{ props.config.persona.biografia == "" ? "Aún no se ha registrado una biografía para este usuario." : props.config.persona.biografia }}</p>
        </div>
      </div>

      <div class="mt-8 text-center w-full md:w-fit" v-if="props.config.isEditable">
        <router-link :to="{ name: 'perfil editar' }">
          <BaseButton
            styleType="primary"
            class="px-8 py-3 bg-[var(--primary)] text-white text-lg font-semibold hover:bg-[var(--primary)] transition duration-300 ease-in-out"
          >
            Editar Perfil
          </BaseButton>
        </router-link>
      </div>
    </div>
  </div>
</template>
