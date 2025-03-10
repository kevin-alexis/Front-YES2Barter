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

function isValidFileType(fileName: string, fileType: string) {
  return fileName && validFileExtensions[fileType].includes(fileName.split('.').pop()?.toLowerCase() || '')
}

const { errors, defineField, handleSubmit, setValues } = useForm({
  validationSchema: yup.object({
    nombre: yup.string().required('El nombre es obligatorio'),
    descripcion: yup.string().required('La descripción es obligatoria'),
    idCategoria: yup.string().required('La categoría es obligatoria'),
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
      .test('is-valid-type', 'El formato de la imagen no es válido', (value) => {
        if (!isEdit.value && value) {
          return isValidFileType(value.name, 'image')
        }
        return true
      }),
    estado: yup.string().required('El estado es obligatorio'),
  }),
})

const [nombre] = defineField('nombre', {
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
const [estado] = defineField('estado', { validateOnModelUpdate: true })


const contactForm = reactive({
  nombre: nombre,
  descripcion: descripcion,
  idCategoria: idCategoria,
  fechaPublicacion: fechaPublicacion,
  rutaImagen: rutaImagen,
  estado: estado,
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

onMounted(async () => {})
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
            label: 'Nombre',
            placeholder: 'Nombre',
            type: 'text',
            isRequired: true,
            model: 'nombre',
          },
          {
            label: 'Descripción',
            placeholder: 'Descripción',
            type: 'textarea',
            isRequired: true,
            model: 'descripcion',
          },
          {
            label: 'Categoría',
            placeholder: 'Categoría',
            type: 'select',
            select: {
              data: categoriaStore.list,
              paramKey: 'nombre',
              valueKey: 'id',
            },
            isRequired: true,
            isDisabled: isEdit,
            model: 'idCategoria',
          },
          {
            label: 'Fecha de Publicación',
            placeholder: 'Fecha de Publicación',
            type: 'date',
            isRequired: true,
            model: 'fechaPublicacion',
          },
          {
            label: 'Imagen',
            placeholder: 'Imagen',
            type: 'file',
            isRequired: !isEdit,
            model: 'rutaImagen',
          },
          {
            label: 'Estado',
            placeholder: 'Estado',
            type: 'select',
            select: {
              data: [
                { nombre: 'Nuevo', id: '0' },
                { nombre: 'Usado', id: '1' },
              ],
              paramKey: 'nombre',
              valueKey: 'id',
            },
            isRequired: true,
            model: 'estado',
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
