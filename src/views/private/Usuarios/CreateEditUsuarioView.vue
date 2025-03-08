<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import type { IUser } from '@/interfaces/account/IAccount'
import { useAccountStore } from '@/stores/account'
import { onMounted, reactive, ref } from 'vue'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
const accountStore = useAccountStore()
import { useRoute } from 'vue-router'

const isEdit = ref(false)
const route = useRoute()
const idPersona = ref('')

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    nombre: yup.string().required('El nombre es obligatorio'),
    email: yup.string().email('Correo incorrecto').required('El correo es requerido'),
    idRol: yup.string().required('El rol es obligatorio'),
    // password: yup
    //   .string()
    //   .min(6, 'La contraseña debe tener al menos 6 caracteres')
    //   .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    //   .matches(/[0-9]/, 'La contraseña debe contener al menos un número')
    //   .matches(/[\W_]/, 'La contraseña debe contener al menos un carácter especial')
    //   .required('La contraseña es requerida'),
    // confirmarPassword: yup
    //   .string()
    //   .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    //   .required('La confirmación de la contraseña es obligatoria'),
    password: yup
      .string()
      .test('required-if-not-edit', 'La contraseña es requerida', function (value) {
        if (!isEdit.value && !value) {
          return this.createError({ message: 'La contraseña es requerida' })
        }
        return true
      })
      .test('min-length', 'La contraseña debe tener al menos 6 caracteres', (value) => {
        if (!isEdit.value && value) {
          return value.length >= 6
        }
        return true
      })
      .test(
        'has-uppercase',
        'La contraseña debe contener al menos una letra mayúscula',
        (value) => {
          if (!isEdit.value && value) {
            return /[A-Z]/.test(value)
          }
          return true
        },
      )
      .test('has-number', 'La contraseña debe contener al menos un número', (value) => {
        if (!isEdit.value && value) {
          return /[0-9]/.test(value)
        }
        return true
      })
      .test(
        'has-special-char',
        'La contraseña debe contener al menos un carácter especial',
        (value) => {
          if (!isEdit.value && value) {
            return /[\W_]/.test(value)
          }
          return true
        },
      ),

    confirmarPassword: yup
      .string()
      .test(
        'required-if-not-edit',
        'La confirmación de la contraseña es obligatoria',
        function (value) {
          if (!isEdit.value && !value) {
            return this.createError({ message: 'La confirmación de la contraseña es obligatoria' })
          }
          return true
        },
      )
      .test('password-match', 'Las contraseñas no coinciden', function (value) {
        if (!isEdit.value && value) {
          return value === this.parent.password
        }
        return true
      }),
  }),
})

const [nombre] = defineField('nombre', {
  validateOnModelUpdate: true,
})

const [email] = defineField('email', {
  validateOnModelUpdate: true,
})

const [idRol] = defineField('idRol', {
  validateOnModelUpdate: true,
})

const [password] = defineField('password', {
  validateOnModelUpdate: true,
})

const [confirmarPassword] = defineField('confirmarPassword', {
  validateOnModelUpdate: true,
})

const dataForm: IUser = reactive({
  nombre: nombre,
  email: email,
  password: password,
  confirmarPassword: confirmarPassword,
  idRol: idRol,
})

const handleSubmitForm = handleSubmit((values: FormValues) => {
  if (!isEdit.value) {
    accountStore.signIn(values)
  } else {
    accountStore.update(idPersona.value, values)
  }
})

onMounted(async () => {
  isEdit.value = route.fullPath.includes('editar')
  if (isEdit.value) {
    idPersona.value = route.params.idPersona as string
    await accountStore.getById(idPersona.value).then((response) => {
      Object.assign(dataForm, response.data)
    })
  }
  await accountStore.getAllRoles()
})
</script>

<template>
  <div class="p-5 w-full">
    <BaseForm
      class="max-w-4xl mx-auto p-5 sm:p-8 md:p-10 lg:p-12"
      v-model:model="dataForm"
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
            label: 'Rol',
            type: 'select',
            select: {
              data: accountStore.listRoles,
              paramKey: 'name',
              valueKey: 'id',
            },
            isRequired: true,
            model: 'idRol',
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
        titleButton: isEdit ? 'Editar' : 'Crear',
        isCanceled: true,
      }"
    >
      <template #headerForm>
        <h1 class="text-[var(--primary)] text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          {{ isEdit ? 'Editar' : 'Crear' }} Usuario
        </h1>
      </template>
    </BaseForm>
  </div>
</template>
