<script setup lang="ts">
import { ref, computed, withDefaults } from 'vue'
import type { IObjeto } from '@/interfaces/objeto/IObjeto'
import type { IUsuario } from '@/interfaces/usuario/IUsuario.'

const URL_API_SOURCE = import.meta.env.VITE_APP_URL_API_SOURCE

// Props for the component
const props = withDefaults(
  defineProps<{
    objeto: IObjeto
    vendedor: IUsuario
  }>(),
  {
    objeto: () => ({
      nombre: 'Objeto de prueba',
      descripcion: 'Esta es una descripción de prueba para que se use algo.',
      fechaPublicacion: '2023-10-01',
      rutaImagen: 'https://www.centroeleia.edu.mx/blog/wp-content/uploads/2017/10/objeto-transicional.jpg',
      precio: 100,
    }),
    vendedor: () => ({
      nombre: 'Vendedor de prueba',
      biografia: 'Esta es una biografía de prueba.',
      otrosObjetos: [
        { id: 1, nombre: 'Objeto 1' },
        { id: 2, nombre: 'Objeto 2' },
      ],
    }),
  },
)

// For handling bid submission
const ofertaActual = ref('')
const isSubmitting = ref(false)

// Function to submit a bid
const enviarOferta = async () => {
  if (!ofertaActual.value) return

  isSubmitting.value = true
  try {
    // API call to submit bid would go here
    console.log('Enviando oferta:', ofertaActual.value)
    // Reset after submission
    ofertaActual.value = ''
  } catch (error) {
    console.error('Error al enviar oferta:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Format date for display
const fechaFormateada = computed(() => {
  if (!props.objeto.fechaPublicacion) return ''

  const fecha = new Date(props.objeto.fechaPublicacion)
  return fecha.toLocaleDateString('es-ES')
})
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Left column - Item details -->
      <div class="flex flex-col">
        <h1 class="text-2xl font-bold mb-4">{{ objeto.nombre }}</h1>

        <div class="mb-6">
          <img
            :src="URL_API_SOURCE + objeto.rutaImagen"
            :alt="objeto.nombre"
            class="w-full h-80 object-cover rounded-lg shadow-md"
          />
        </div>

        <div class="mb-4">
          <h2 class="text-xl font-semibold mb-2">Descripción</h2>
          <p class="text-gray-700">{{ objeto.descripcion }}</p>
        </div>

        <div>
          <h2 class="text-lg font-semibold mb-1">Fecha de publicación</h2>
          <p class="text-gray-600">{{ fechaFormateada }}</p>
        </div>
      </div>

      <!-- Right column - Seller info and bid form -->
      <div class="flex flex-col">
        <div class="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 class="text-xl font-semibold mb-3">Información del vendedor</h2>
          <p class="font-bold mb-1">{{ vendedor.nombre }}</p>
          <p class="text-gray-700 mb-4">{{ vendedor.biografia || 'Sin biografía' }}</p>

          <div v-if="vendedor.otrosObjetos && vendedor.otrosObjetos.length > 0">
            <h3 class="text-lg font-semibold mb-2">Otros objetos del vendedor</h3>
            <select class="w-full p-2 border rounded-md">
              <option disabled selected>Seleccionar objeto</option>
              <option v-for="item in vendedor.otrosObjetos" :key="item.id" :value="item.id">
                {{ item.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold mb-3">Hacer oferta</h2>
          <p class="mb-3">
            Precio actual: <span class="font-bold">{{ objeto.precio || 'Sin ofertas' }}</span>
          </p>

          <div class="flex flex-col">
            <input
              v-model="ofertaActual"
              type="number"
              placeholder="Ingrese su oferta"
              class="p-2 border rounded-md mb-3"
            />
            <button
              @click="enviarOferta"
              :disabled="isSubmitting || !ofertaActual"
              class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-400"
            >
              {{ isSubmitting ? 'Enviando...' : 'Hacer oferta' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
