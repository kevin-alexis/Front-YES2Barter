<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import { useObjetoStore } from '@/stores/objeto'
import { useCategoriaStore } from '@/stores/categoria'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
const objetoStore = useObjetoStore()
const categoriaStore = useCategoriaStore()

const route = useRoute()
const isEdit = ref(false)
const id = ref('')

// const MAX_FILE_SIZE = 102400; //100KB

const validFileExtensions = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] }

function isValidFileType(fileName, fileType) {
  return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1
}

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    titulo: yup.string().required('El nombre es obligatorio'),
    descripcion: yup.string().required('La descripción es obligatoria'),
    idCategoria: yup.string().required('La categoría es obligatorio'),
    fechaPublicacion: yup
      .date()
      .required('La fecha de publicación es obligatoria')
      .max(new Date().toISOString().split('T')[0], 'La fecha no puede ser posterior a hoy'),
    rutaImagen: yup
      .mixed()
      .test('required-if-not-edit', 'La imagen es obligatoria', function (value) {
        if (!isEdit.value && !value) {
          return this.createError({ message: 'La imagen es obligatoria' })
        }
        return true
      })
      .test('is-valid-type', 'El formato de la imagen no es valido', (value) => {
        if (!isEdit.value && value) {
          return isValidFileType(value && value.name.toLowerCase(), 'image')
        }
        return true
      }),
  }),
})

const [titulo] = defineField('titulo', {
  validateOnModelUpdate: true,
})

const [descripcion] = defineField('descripcion', {
  validateOnModelUpdate: true,
})

const [idCategoria] = defineField('idCategoria', {
  validateOnModelUpdate: true,
})

const [fechaPublicacion] = defineField('fechaPublicacion', {
  validateOnModelUpdate: true,
})

const [rutaImagen] = defineField('rutaImagen', {
  validateOnModelUpdate: true,
})

const contactForm = reactive({
  titulo: titulo,
  descripcion: descripcion,
  idCategoria: idCategoria,
  fechaPublicacion: fechaPublicacion,
  rutaImagen: rutaImagen,
})

const handleSubmitForm = handleSubmit((values: FormValues) => {
  //validaciones
  if (!isEdit.value) {
    objetoStore.create(values)
  } else {
    objetoStore.update(id.value, values)
  }
})

onMounted(async () => {
  await categoriaStore.getAll()
  isEdit.value = route.fullPath.includes('editar')
  id.value = route.params.id as string
  if (isEdit.value) {
    await objetoStore.getById(id.value).then((response) => {
      Object.assign(contactForm, {
        ...response,
      })
    })
  } else {
    Object.assign(contactForm, {
      idCategoria: id.value,
    })
  }
})
</script>

<template>
  <div class="p-5 w-full">
    <BaseForm
      class="max-w-4xl mx-auto p-5 sm:p-8 md:p-10 lg:p-12"
      v-model:model="contactForm"
      v-model:errors="errors"
      @submit="handleSubmitForm"
      :config="{
        inputs: [
          {
            label: 'Titulo',
            placeholder: 'Título',
            type: 'text',
            isRequired: true,
            model: 'titulo',
          },
          {
            label: 'Descripcion',
            placeholder: 'Descripción',
            type: 'textarea',
            isRequired: true,
            model: 'descripcion',
          },
          {
            label: 'Categoria',
            placeholder: 'Categoria',
            type: 'select',
            select: {
              data: categoriaStore.list,
              paramKey: 'nombre',
              valueKey: 'id',
            },
            isRequired: true,
            isDisabled: true, // esto segun sea creación o edición
            model: 'idCategoria',
          },
          {
            label: 'Fecha Publicación',
            placeholder: 'Fecha publicación',
            type: 'date',
            isRequired: true,
            model: 'fechaPublicacion',
          },
          {
            label: 'Imagen',
            placeholder: 'Imagen',
            type: 'file',
            isRequired: true,
            model: 'rutaImagen',
          },
        ],
        titleButton: isEdit ? 'Editar' : 'Crear',
        isCanceled: true,
      }"
    >
      <template #headerForm>
        <h1 class="text-[var(--primary)] text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          {{ isEdit ? 'Editar' : 'Crear' }} Objeto
        </h1>
      </template>
    </BaseForm>
  </div>
</template>
