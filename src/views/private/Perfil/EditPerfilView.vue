<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import { useAccountStore } from '@/stores/account'
import { usePersonaStore } from '@/stores/persona';
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import * as yup from 'yup'
import { useForm } from 'vee-validate'

const accountStore = useAccountStore()
const personaStore = usePersonaStore()

const route = useRoute()
const isEdit = ref(false)
const id = ref('')

const validFileExtensions: { [key: string]: string[] } = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] }

function isValidFileType(fileName: string, fileType: string) {
  return fileName && validFileExtensions[fileType].includes(fileName.split('.').pop()?.toLowerCase() || '')
}

interface FormValues{
  nombre: string;
  biografia: string;
  rutaFotoPerfil?: File;
}

const { errors, defineField, handleSubmit } = useForm<FormValues>({
  validationSchema: yup.object({
    nombre: yup.string().required('El nombre es obligatorio'),
    biografia: yup.string().required('La biografía es obligatoria'),
    rutaFotoPerfil: yup
      .mixed()
      .test('required-if-not-edit', 'La imagen es obligatoria', function (value) {
        if (!isEdit.value && !value) {
          return this.createError({ message: 'La imagen es obligatoria' })
        }
        return true
      })
      .test('is-valid-type', 'El formato de la imagen no es válido', (value) => {
        if (!isEdit.value && value) {
          if (value instanceof File) {
            return isValidFileType(value.name, 'image');
          } else {
            return this.createError({ message: 'El valor no es un archivo válido' });
          }
        }
        return true;
      }),
  }),
});


const [nombre] = defineField('nombre', {
  validateOnModelUpdate: true,
})

const [biografia] = defineField('biografia', {
  validateOnModelUpdate: true,
})

const [rutaFotoPerfil] = defineField('rutaFotoPerfil', {
  validateOnModelUpdate: true,
})

const contactForm = reactive({
  nombre: nombre,
  biografia: biografia,
  rutaFotoPerfil: rutaFotoPerfil,
})

const handleSubmitForm = handleSubmit(async (values: FormValues) => {
  const formData = new FormData()

  formData.append('Nombre', values.nombre)
  formData.append('Biografia', values.biografia)

  if (values.rutaFotoPerfil) {
    formData.append('RutaFotoPerfil', values.rutaFotoPerfil)
  }

  if (isEdit.value) {
    // Actualiza la persona
    personaStore.updatePersona(id.value, formData)
  } else {
  }
})

onMounted(async () => {
  await accountStore.getUser()

  if (accountStore.user) {
  await personaStore.getPersonaByIdUsuario(accountStore.user.idUsuario).then(() => {
    Object.assign(contactForm, {
      ...personaStore.persona,
    });
  });
}
  isEdit.value = route.fullPath.includes('editar')
})
</script>

<template>
  <div class="p-6 sm:p-8 lg:p-12 w-full">
    <BaseForm
      class="max-w-4xl mx-auto p-6 sm:p-8 md:p-10 lg:p-12 bg-white rounded-xl shadow-lg"
      v-model:model="contactForm"
      v-model:errors="errors"
      @submit="handleSubmitForm"
      :config="{
        inputs: [
          {
            label: 'Nombre',
            placeholder: 'Nombre',
            type: 'text',
            isRequired: true,
            model: 'nombre',
            //class: 'border-2 border-gray-300 p-3 rounded-md w-full'
          },
          {
            label: 'Biografía',
            placeholder: 'Biografía',
            type: 'textarea',
            isRequired: true,
            model: 'biografia',
            //class: 'border-2 border-gray-300 p-3 rounded-md w-full h-32'
          },
          {
            label: 'Foto de Perfil',
            placeholder: 'Imagen',
            type: 'file',
            isRequired: !isEdit,
            model: 'rutaFotoPerfil',
            //class: 'border-2 border-gray-300 p-3 rounded-md w-full'
          },
        ],
        titleButton: isEdit ? 'Editar' : 'Crear',
        isCanceled: true,
      }"
    >
      <template #headerForm>
        <h1 class="text-4xl sm:text-5xl text-center font-bold text-[var(--primary)] mb-8">
          {{ isEdit ? 'Editar Perfil' : 'Crear Perfil' }}
        </h1>
      </template>
    </BaseForm>
  </div>
</template>
