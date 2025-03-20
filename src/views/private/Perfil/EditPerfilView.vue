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

const validFileExtensions = { image: ['jpg', 'png', 'jpeg', 'svg', 'webp'] }

function isValidFileType(fileName: string, fileType: string) {
  return fileName && validFileExtensions[fileType].includes(fileName.split('.').pop()?.toLowerCase() || '')
}

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    nombre: yup.string().required('El nombre es obligatorio'),
    biografia: yup.string(),
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
          return isValidFileType(value.name, 'image')
        }
        return true
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

const handleSubmitForm = handleSubmit((values: FormValues) => {
  personaStore.updatePersona(id.value, values)
})

onMounted(async () => {
  await accountStore.getUser()

  if (accountStore.user) {
  await personaStore.getPersonaByIdUsuario(accountStore.user.idUsuario).then((response) => {
    Object.assign(contactForm, {
      ...response,
    });

    id.value = response.id;
  });
}
  isEdit.value = route.fullPath.includes('editar')
})
</script>

<template>
  <div class="p-6 sm:p-8 lg:p-12 w-full">
    <BaseForm
      class="max-w-4xl mx-auto p-6 sm:p-8 md:p-10 lg:p-12 "
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
          },
          {
            label: 'Biografía',
            placeholder: 'Biografía',
            type: 'textarea',
            isRequired: false,
            model: 'biografia',
          },
          {
            label: 'Foto de Perfil',
            placeholder: 'Imagen',
            type: 'file',
            isRequired: !isEdit,
            model: 'rutaFotoPerfil',
          },
        ],
        titleButton: 'Editar',
        isCanceled: true,
      }"
    >
      <template #headerForm>
        <h1 class="text-4xl sm:text-5xl text-center font-bold text-[var(--primary)] mb-8">
          Editar Perfil
        </h1>
      </template>
    </BaseForm>
  </div>
</template>
