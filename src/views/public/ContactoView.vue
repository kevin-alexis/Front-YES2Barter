<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { reactive, ref } from 'vue'
import emailjs from 'emailjs-com'
import Swal from 'sweetalert2'

const isLoading = ref(false);
const PUBLIC_KEY = import.meta.env.VITE_APP_MAILJS_PUBLIC_KEY
const SERVICE_ID = import.meta.env.VITE_APP_MAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_APP_MAILJS_TEMPLATE_ID

emailjs.init(PUBLIC_KEY)

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: yup.object({
    name: yup.string().required('El nombre es obligatorio'),
    email: yup.string().email('Correo incorrecto').required('El correo es requerido'),
    phoneNumber: yup
      .number()
      .min(6, 'Mínimo 6 caracteres')
      .required('El número de teléfono es obligatorio'),
    message: yup.string().required('El mensaje es obligatorio'),
  }),
})

const [name] = defineField('name', {
  validateOnModelUpdate: true,
})

const [email] = defineField('email', {
  validateOnModelUpdate: true,
})

const [phoneNumber] = defineField('phoneNumber', {
  validateOnModelUpdate: true,
})

const [message] = defineField('message', {
  validateOnModelUpdate: true,
})

const dataForm = reactive({
  name: name,
  email: email,
  phoneNumber: phoneNumber,
  message: message,
})

const handleSubmitForm = handleSubmit(async (values: FormValues) => {
  try {
    const form = {
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber,
      message: values.message,
    }

    isLoading.value = true;

    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)

    Swal.fire({
      title: '¡Éxito!',
      text: 'Tu mensaje ha sido enviado correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    })

    resetForm()
  } catch (error) {
    console.error('Error al enviar el correo:', error)

    Swal.fire({
      title: '¡Error!',
      text: 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    })
  } finally {
    isLoading.value = false;
  }
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
            model: 'name',
          },
          {
            label: 'Correo Electrónico',
            placeholder: 'user@example.com',
            type: 'email',
            isRequired: true,
            model: 'email',
          },
          {
            label: 'Número de teléfono',
            type: 'number',
            isRequired: true,
            model: 'phoneNumber',
          },
          {
            label: 'Mensaje',
            placeholder: 'Mensaje',
            type: 'textarea',
            isRequired: true,
            model: 'message',
          },
        ],
        titleButton: 'Enviar',
        isLoading: isLoading,
      }"
    >
      <template #headerForm>
        <h1 class="text-[var(--primary)] text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold text-center">Contáctanos</h1>
        <h2 class="text-[var(--primary)] text-3xl sm:text-4xl md:text-5xl font-normal text-center mt-4">¡Ayúdanos a mejorar!</h2>
      </template>
    </BaseForm>
  </div>
</template>
