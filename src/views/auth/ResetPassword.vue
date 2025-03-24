<template>
  <div class="min-h-screen bg-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white shadow-lg rounded-xl border border-green-100 p-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-green-800">Restablecer Contraseña</h2>
        <p class="mt-2 text-sm text-green-600">Ingresa tu nueva contraseña</p>
      </div>
      <form @submit.prevent="resetPassword" class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="mb-4">
            <label class="block text-green-700 text-sm font-bold mb-2">Nueva Contraseña:</label>
            <input
              type="password"
              v-model="newPassword"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Introduce tu nueva contraseña"
            />
          </div>
          <div class="mb-6">
            <label class="block text-green-700 text-sm font-bold mb-2">Confirmar Contraseña:</label>
            <input
              type="password"
              v-model="confirmPassword"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Confirma tu nueva contraseña"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Restablecer
          </button>
        </div>
      </form>

      <p
        v-if="message"
        class="mt-4 text-center text-sm text-green-600 bg-green-50 p-3 rounded-md"
      >
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

export default defineComponent({
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      message: '',
    }
  },
  setup() {
    const route = useRoute()
    return { route }
  },
  methods: {
    async resetPassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.message = 'Las contraseñas no coinciden'
        return
      }

      try {
        const response = await axios.post('https://localhost:7257/api/Account/reset-password', {
          email: this.route.query.email,
          resetToken: this.route.query.token,
          newPassword: this.newPassword,
        })

        this.message = response.data.message
      } catch (error) {
        this.message = error.response?.data?.message || 'Error al restablecer la contraseña'
      }
    },
  },
})
</script>
