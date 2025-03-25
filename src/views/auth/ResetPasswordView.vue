<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import { RouterLink, useRoute } from 'vue-router'
import { reactive } from 'vue'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { useAccountStore } from '@/stores/account'

const accountStore = useAccountStore()
const route = useRoute()

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    newPassword: yup
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
      .matches(/[0-9]/, 'La contraseña debe contener al menos un número')
      .matches(/[\W_]/, 'La contraseña debe contener al menos un carácter especial')
      .required('La contraseña es requerida'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden')
      .required('La confirmación de la contraseña es requerida'),
  }),
})

const [newPassword] = defineField('newPassword', {
  validateOnModelUpdate: true,
})

const [confirmPassword] = defineField('confirmPassword', {
  validateOnModelUpdate: true,
})

const resetData = reactive({
  newPassword,
  confirmPassword,
})

const handleSubmitForm = handleSubmit((values) => {
  const { email, token } = route.query

  if (typeof email === 'string' && typeof token === 'string') {
    const decodedEmail = decodeURIComponent(email)
    const decodedToken = decodeURIComponent(token)

    accountStore.resetPassword({
      email: decodedEmail,
      resetToken: decodedToken,
      newPassword: values.newPassword,
    })
  } else {
    console.error('No se encontraron los parámetros email o token en la URL')
  }
})
</script>

<template>
  <div class="min-h-screen bg-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div
      class="max-w-md w-full space-y-8 bg-white shadow-lg rounded-xl border border-green-100 p-8 mt-[-125px]"
    >
      <div class="text-center">
        <h2 class="text-3xl font-bold text-center mb-5">Restablecer Contraseña</h2>
        <p>Ingresa tu nueva contraseña</p>
      </div>

      <BaseForm
        v-model:model="resetData"
        v-model:errors="errors"
        @submit="handleSubmitForm"
        :config="{
          inputs: [
            {
              label: 'Nueva Contraseña',
              type: 'password',
              isRequired: true,
              model: 'newPassword',
            },
            {
              label: 'Confirmar Contraseña',
              type: 'password',
              isRequired: true,
              model: 'confirmPassword',
            },
          ],
          titleButton: 'Restablecer',
        }"
      >
        <template #headerForm>
          <h1 class="text-4xl font-bold text-left"></h1>
        </template>

        <!-- <template #linkBottom>
          <p>
            ¿Ya tienes cuenta?
            <RouterLink class="font-semibold text-[var(--primary)] cursor-pointer" to="/login">
              Iniciar sesión
            </RouterLink>
          </p>
        </template> -->
      </BaseForm>

      <!-- <p v-if="message" class="mt-4 text-center text-sm text-green-600 bg-green-50 p-3 rounded-md">
        {{ message }}
      </p> -->
    </div>
  </div>
</template>
