<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import { RouterLink } from 'vue-router'
import { useAccountStore } from '@/stores/account'
import { reactive, ref } from 'vue'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import type { IUser } from '@/interfaces/account/IAccount'
import Checkbox from 'primevue/checkbox';

const accountStore = useAccountStore()

// Validaciones con VeeValidate
const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    email: yup.string().email('Correo incorrecto').required('El correo es requerido'),
    password: yup
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('La contraseña es requerida'),
    rememberMe: yup.boolean().optional(),
  }),
})

// Definir campos del formulario
const [email] = defineField('email', {
  validateOnModelUpdate: true,
})

const [password] = defineField('password', {
  validateOnModelUpdate: true,
})

const [rememberMe] = defineField('rememberMe', {
  validateOnModelUpdate: true,
})

const user: IUser = reactive({
  email: email,
  password: password,
  rememberMe: rememberMe,
})

// Función para manejar el formulario
const handleSubmitForm = handleSubmit((values: FormValues) => {
  accountStore.login({ email: values.email, password: values.password }, values.rememberMe)
})
</script>

<template>
  <div class="flex flex-col lg:flex-row">
    <div
      class="lg:flex items-end bg-gradient-to-t from-[var(--primary)] to-[var(--primary-gradient)] min-h-screen w-full rounded-l-xl hidden"
    >
      <!-- <img :src="ImageLogin" /> -->
    </div>
    <div class="min-h-screen w-full">
      <BaseForm
        class="p-5 md:p-10 lg:p-20"
        v-model:model="user"
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
            {
              label: 'Contraseña',
              type: 'password',
              isRequired: true,
              model: 'password',
            },
            {
              label: 'Recordar',
              type: 'checkbox',
              model: 'rememberMe',
              isRequired: false,
            }
          ],
          titleButton: 'Iniciar Sesión',
        }"
      >
        <template #headerForm>
          <h1 class="text-4xl font-bold text-left">Inicio de Sesión</h1>
        </template>
        <!-- Link para registro -->
        <template #linkBottom>
          <p>
            ¿Aún no tienes cuenta?
            <RouterLink class="font-semibold text-[var(--primary)] cursor-pointer" to="/sign-in">
              Regístrate gratis
            </RouterLink>
          </p>
        </template>
      </BaseForm>
    </div>
  </div>
</template>
