<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const user = ref({
  nombre: '',
  apellidos: '',
  fechaRegistro: '',
  telefono: '',
  biografia: '',
  fotoPerfil: '' // Añadido para manejar la foto de perfil
});

const photoFile = ref<File | null>(null); // Variable para almacenar la imagen seleccionada

const fetchUserProfile = async () => {
  try {
    const response = await axios.get('/api/usuario/perfil');
    user.value = response.data;
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
  }
};

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

onMounted(() => {
  fetchUserProfile();
});
</script>

<template>
  <div class="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
    <h2 class="text-3xl font-semibold text-[var(--primary)] mb-6 text-center">Perfil de Usuario</h2>
    
    <div class="space-y-6">
      <!-- Foto de perfil -->
      <div class="flex justify-center items-center">
        <div class="relative">
          <img 
            v-if="user.fotoPerfil"
            :src="user.fotoPerfil"
            alt="Foto de Perfil"
            class="w-32 h-32 rounded-full object-cover border-4 border-[var(--primary)]"
          />
          <div v-else class="w-32 h-32 rounded-full bg-gray-300 border-4 border-[var(--primary)]"></div>
          
          <!-- Botón de actualizar foto -->
          <input 
            type="file" 
            @change="handleFileChange" 
            accept="image/*" 
            class="absolute bottom-0 right-0 w-8 h-8 bg-[var(--primary)] text-white rounded-full cursor-pointer border-2 border-white transform translate-x-1 translate-y-1 hover:bg-[var(--primary)]"
          />
        </div>
      </div>

      <!-- Información del usuario -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <span class="font-medium text-gray-600">Nombre:</span>
          <span class="text-gray-800 text-lg">{{ user.nombre }} {{ user.apellidos }}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="font-medium text-gray-600">Fecha de Registro:</span>
          <span class="text-gray-800">{{ user.fechaRegistro }}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="font-medium text-gray-600">Teléfono:</span>
          <span class="text-gray-800">{{ user.telefono }}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="font-medium text-gray-600">Biografía:</span>
          <p class="text-gray-800">{{ user.biografia }}</p>
        </div>
      </div>
    </div>

    <!-- Formulario de actualización de foto -->
    <div class="mt-8 text-center">
      <button 
        @click="updateProfilePicture"
        class="px-8 py-3 bg-[var(--primary)] text-white rounded-full text-lg font-semibold hover:bg-[var(--primary)] transition duration-300 ease-in-out">
        Actualizar Foto
      </button>
    </div>

    <!-- Botón de editar perfil -->
    <div class="mt-8 text-center">
      <router-link to="/editar-perfil">
        <button class="px-8 py-3 bg-[var(--primary)] text-white rounded-full text-lg font-semibold hover:bg-[var(--primary)] transition duration-300 ease-in-out">
          Editar Perfil
        </button>
      </router-link>
    </div>
  </div>
</template>
