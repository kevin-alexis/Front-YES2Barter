<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAccountStore } from '@/stores/account'
import { RouterLink } from 'vue-router'
import { reactive } from 'vue'

const accountStore = useAccountStore()

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    email: yup.string().email('Correo inválido').required('El correo es requerido'),
  }),
})

const [email] = defineField('email', {
  validateOnModelUpdate: true,
})

const formData = reactive({
  email,
})

const handleSubmitForm = handleSubmit((values) => {
  try {
    accountStore.forgotPassword({ email: values.email })
  } catch (error) {
    console.error('Error al enviar enlace de recuperación:', error)
    alert('No se pudo enviar el enlace de recuperación. Por favor, inténtalo de nuevo.')
  }
})
</script>

<template>
  <div class="min-h-screen bg-[var(--background)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div
      class="max-w-md w-full space-y-8 bg-white shadow-lg rounded-xl border border-green-100 p-8 mt-[-125px]"
    >
      <div class="text-center">
        <h2 class="text-3xl font-bold text-center mb-5">Recuperar Contraseña</h2>
        <p>Introduce tu correo y te enviaremos instrucciones para restablecer tu contraseña</p>
      </div>

      <BaseForm
        v-model:model="formData"
        v-model:errors="errors"
        @submit="handleSubmitForm"
        :config="{
          inputs: [
            {
              label: 'Correo Electrónico',
              type: 'email',
              isRequired: true,
              model: 'email',
            },
          ],
          titleButton: 'Enviar Enlace',
        }"
      >
        <template #linkBottom>
          <p>
            ¿Ya tienes cuenta?
            <RouterLink class="font-semibold text-[var(--primary)] cursor-pointer" to="/login">
              Iniciar sesión
            </RouterLink>
          </p>
        </template>
      </BaseForm>
    </div>
  </div>
</template>
