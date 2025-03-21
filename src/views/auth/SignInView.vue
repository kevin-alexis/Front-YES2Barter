<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import { useAccountStore } from '../../stores/account'
import type { IUser } from '@/interfaces/account/IAccount'
import { reactive } from 'vue'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import ImageLogin from '@/assets/signin.png'

const accountStore = useAccountStore()
const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    nombre: yup.string().required('El nombre es obligatorio'),
    email: yup.string().email('Correo incorrecto').required('El correo es requerido'),
    password: yup
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
      .matches(/[0-9]/, 'La contraseña debe contener al menos un número')
      .matches(/[\W_]/, 'La contraseña debe contener al menos un carácter especial')
      .required('La contraseña es requerida'),
    confirmarPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
      .required('La confirmación de la contraseña es obligatoria'),
  }),
})

const [nombre] = defineField('nombre', {
  validateOnModelUpdate: true,
})

const [email] = defineField('email', {
  validateOnModelUpdate: true,
})

const [password] = defineField('password', {
  validateOnModelUpdate: true,
})

const [confirmarPassword] = defineField('confirmarPassword', {
  validateOnModelUpdate: true,
})

const user: IUser = reactive({
  nombre: nombre,
  email: email,
  password: password,
  confirmarPassword: confirmarPassword,
  idRol: '',
})

const handleSubmitForm = handleSubmit((values: FormValues) => {
  //validaciones
  accountStore.signIn(values)
})

</script>
<template>
  <div class="flex flex-col lg:flex-row">
    <div class="min-h-screen w-full">
      <BaseForm
        class="p-5 md:p-10 lg:p-20"
        v-model:model="user"
        v-model:errors="errors"
        @submit="handleSubmitForm"
        :config="{
          inputs: [
            {
              label: 'Nombre',
              placeholder: 'Ingresa tu nombre completo',
              type: 'text',
              isRequired: true,
              model: 'nombre',
            },
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
              label: 'Confirmar Contraseña',
              type: 'password',
              isRequired: true,
              model: 'confirmarPassword',
            },
          ],
          titleButton: 'Registrarse',
        }"
      >
        <template #headerForm>
          <h1 class="text-4xl font-bold text-left">Registro</h1>
        </template>
      </BaseForm>
    </div>

    <div
      class="lg:flex items-center justify-center bg-gradient-to-t from-[var(--primary)] to-[var(--primary-gradient)] min-h-screen w-full  hidden"
    >
      <img :src="ImageLogin" alt="Login Image" class="object-cover" />
    </div>
  </div>
</template>
