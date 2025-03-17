<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import axios from 'axios';
import BaseButton from '../BaseButton.vue';
const baseUrl = import.meta.env.VITE_APP_URL_API_SOURCE
const isLoading = ref(true)
const user = ref({
  nombre: '',
  biografia: '',
  fotoPerfil: ''
});

const photoFile = ref<File | null>(null);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    photoFile.value = input.files[0];
  }
};

const updateProfilePicture = async () => {
  if (!photoFile.value) return;

  const formData = new FormData();
  formData.append('photo', photoFile.value);

  try {
    const response = await axios.post('/api/usuario/actualizar-foto', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    user.value.fotoPerfil = response.data.fotoPerfil; // Actualizar la foto del usuario
    alert('Foto de perfil actualizada exitosamente');
  } catch (error) {
    console.error('Error al actualizar la foto:', error);
    alert('Error al actualizar la foto');
  }
};

defineProps<{
  config:{
    persona: any,
    isEditable: boolean
  }
}>()

onBeforeMount(async () => {
  isLoading.value = false
})

</script>

<template>
  <div class="w-full mx-auto p-8">
    <h2 class="text-3xl font-semibold text-[var(--primary)] mb-6 text-center">Perfil {{ config.isEditable ? 'de Usuario' : 'del Intercambiador'}} </h2>

    <div class="  ">
      <div class="flex justify-center items-center">
        <div class="relative">
          <img
            v-if="config.persona.rutaFotoPerfil"
            :src="baseUrl + config.persona.rutaFotoPerfil"
            alt="Foto de Perfil"
            class="w-32 h-32 rounded-full object-cover border-4 border-[var(--primary)]"
          />
          <div v-else class="w-32 h-32 rounded-full bg-gray-300 border-4 border-[var(--primary)]"></div>

          <input
            v-if="config.isEditable"
            type="file"
            @change="handleFileChange"
            accept="image/*"
            class="absolute bottom-0 right-0 w-8 h-8 bg-[var(--primary)] text-white rounded-full cursor-pointer border-2 border-white transform translate-x-1 translate-y-1 hover:bg-[var(--primary)]"
          />
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex flex-col md:flex-row justify-start items-start md:items-center">
          <span class="font-medium text-gray-600">Nombre:&nbsp;</span>
          <span class="text-gray-800 text-lg">{{ config.persona.nombre }}</span>
        </div>

        <div class="flex flex-col md:flex-row justify-start items-start md:items-center">
          <span class="font-medium text-gray-600">Fecha de Registro:&nbsp;</span>
          <span class="text-gray-800">{{ user.fechaRegistro }}</span>
        </div>

        <div class="flex flex-col md:flex-row justify-start items-start md:items-center">
          <span class="font-medium text-gray-600">Biografía:&nbsp;</span>
          <p class="text-gray-800">{{ config.persona.biografia == "" ? "¡Cuéntanos más sobre ti! Agrega tu bio para que te conozcan mejor." : config.persona.biografia}}</p>
        </div>
      </div>
    </div>

    <div class="flex justify-center w-full" v-if="config.isEditable">
      <div class="mt-8 text-center w-full md:w-fit">
      <router-link :to="{name: 'perfil editar'}">
        <BaseButton styleType="primary" class="px-8 py-3 bg-[var(--primary)] text-white text-lg font-semibold hover:bg-[var(--primary)] transition duration-300 ease-in-out">
          Editar Perfil
        </BaseButton>
      </router-link>
    </div>
    </div>
  </div>
</template>
