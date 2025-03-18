<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import axios from 'axios';
import BaseButton from '../BaseButton.vue';
import Swal from 'sweetalert2';
import 'primeicons/primeicons.css';

const baseUrl = import.meta.env.VITE_APP_URL_API_SOURCE;
const isLoading = ref(true);
const user = ref({
  nombre: '',
  biografia: '',
  fotoPerfil: ''
});

const photoFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    photoFile.value = input.files[0];
    updateProfilePicture();
  }
};

const updateProfilePicture = async () => {
  console.log('Entrando en updateProfilePicture');
  if (!photoFile.value) {
    // Si no se ha seleccionado una foto, muestra la alerta
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No se ha agregado la foto.',
      confirmButtonColor: '#3085d6',
    });
    return;
  }

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

const triggerFileInput = () => {
  fileInput.value?.click();
};

defineProps<{
  config: {
    persona: any,
    isEditable: boolean
  }
}>();

onBeforeMount(async () => {
  isLoading.value = false;
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-xl mt-16">
    <h2 class="text-3xl font-semibold text-[var(--primary)] mb-6 text-center">
      Perfil {{ config.isEditable ? 'de Usuario' : 'del Intercambiador' }}
    </h2>

    <div class="flex flex-col items-center space-y-6">
      <div class="relative">
        <img
          v-if="config.persona.rutaFotoPerfil"
          :src="baseUrl + config.persona.rutaFotoPerfil"
          alt="Foto de Perfil"
          class="w-32 h-32 rounded-full object-cover border-4 border-[var(--primary)]"
        />
        <div v-else class="w-32 h-32 rounded-full bg-gray-300 border-4 border-[var(--primary)]"></div>

        <!-- Botón para subir imagen -->
        <button
          v-if="config.isEditable"
          @click="triggerFileInput"
          class="absolute bottom-0 right-0 bg-[var(--primary)] p-2 rounded-full border-2 border-[var(--primary)] shadow-md hover:bg-[var(--primary)] hover:border-[var(--primary)] w-8 h-8 flex items-center justify-center"
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
        <div class="flex justify-between">
          <span class="font-medium">Nombre:</span>
          <span class="text-lg">{{ config.persona.nombre }}</span>
        </div>

        <div class="flex flex-col justify-between">
          <span class="font-medium">Biografía:</span>
          <p class="text-gray-600">
            {{
              config.persona.biografia === ""
                ? "¡Cuéntanos más sobre ti! Agrega tu bio para que te conozcan mejor."
                : config.persona.biografia
            }}
          </p>
        </div>
      </div>

      <div class="mt-8 text-center w-full md:w-fit" v-if="config.isEditable">
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
