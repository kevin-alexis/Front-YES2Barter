<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import { useObjetoStore } from '@/stores/objeto'
import { useCategoriaStore } from '@/stores/categoria'
import { usePersonaStore } from '@/stores/persona'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { EstatusObjeto } from '@/common/enums/enums'
import {enumFormat, formatDateToForm} from '@/utils/helper'
import { useAccountStore } from '@/stores/account'

const objetoStore = useObjetoStore()
const categoriaStore = useCategoriaStore()
const personaStore = usePersonaStore()
const tipoEstadoList = Object.values(EstatusObjeto);

const route = useRoute()
const accountStore = useAccountStore()
const isEdit = ref(false)
const id = ref('')
const isIntercambiador = ref(accountStore.user.rol == "Intercambiador")
// const MAX_FILE_SIZE = 102400; //100KB

const validFileExtensions = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] }

function isValidFileType(fileName: string, fileType: string) {
  return fileName && validFileExtensions[fileType].includes(fileName.split('.').pop()?.toLowerCase() || '')
}

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    nombre: yup.string().required('El nombre es obligatorio'),
    descripcion: yup.string().required('La descripción es obligatoria'),
    idCategoria: yup.string().required('La categoría es obligatoria'),
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
    estado: yup.string()
    .test('required-if-not-edit', 'El estado es obligatorio', function (value) {
        if (!isIntercambiador.value) {
          if (!value) {
            return this.createError({ message: 'El estado es obligatoria' });
          }
        }
        return true;
      }),
    idUsuario: yup.string()
      .test('required-if-not-edit', 'El dueño es obligatorio', function (value) {
        if (!isIntercambiador.value) {
          if (!value) {
            return this.createError({ message: 'El usuario es obligatoria' });
          }
        }
        return true;
      })

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

const [rutaImagen] = defineField('rutaImagen', {
  validateOnModelUpdate: true,
})

const [estado] = defineField('estado', { validateOnModelUpdate: true })

const [idUsuario] = defineField('idUsuario', { validateOnModelUpdate: true })


const contactForm = reactive({
  nombre: nombre,
  descripcion: descripcion,
  idCategoria: idCategoria,
  rutaImagen: rutaImagen,
  estado: estado,
  idUsuario: idUsuario,
})

const handleSubmitForm = handleSubmit((values: FormValues) => {
  //validaciones
  if (!isEdit.value) {
    objetoStore.create(values)
  } else {
    objetoStore.update(id.value, values)
  }
})

onMounted( () => {
  categoriaStore.getAll()
  personaStore.getAllPersonasIntercambiadores()

  // Verifica el valor de isEdit
  isEdit.value = route.fullPath.includes('editar')
  id.value = route.params.id as string
  if (isEdit.value) {
    objetoStore.getById(id.value).then((response) => {
      if(response.idUsuario !== accountStore.user.idUsuario && isIntercambiador.value){
        router.back()
      }
      Object.assign(contactForm, {
        ...response,
      })
    }).catch(error => {
      console.error("Error al obtener el objeto:", error)
    })
  } else {
    Object.assign(contactForm, {})
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
            model: 'idCategoria',
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
              data:enumFormat(tipoEstadoList),
              paramKey: 'name',
              valueKey: 'id',
            },
            isDisabled: isEdit,
            isRequired: true,
            isHidden: isIntercambiador,
            model: 'estado',
          },
          {
            label: 'Dueño',
            placeholder: 'Usuario Dueño',
            type: 'select',
            select: {
              data: personaStore.list,
              paramKey: 'nombre',
              valueKey: 'idUsuario',
            },
            isDisabled: isEdit,
            isRequired: true,
            model: 'idUsuario',
            isHidden: isIntercambiador
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
