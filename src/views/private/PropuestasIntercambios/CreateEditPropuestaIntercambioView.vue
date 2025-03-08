<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import { useCapituloStore } from '@/stores/propuestaIntercambio'
import { useObjetoStore } from '@/stores/objeto'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import * as yup from 'yup'
import { useForm } from 'vee-validate'

const capituloStore = useCapituloStore()
const objetoStore = useObjetoStore()
const isEdit = ref(false)
const id = ref('')

const route = useRoute()

const validFileExtensions = { document: ['pdf'] }

function isValidFileType(fileName, fileType) {
  return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1
}

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    numeroCapitulo: yup
      .number()
      .typeError('El número del capítulo debe ser válido')
      .required('El número de capítulo es obligatorio'),
    rutaPDF: yup
      .mixed()
      .required('El documento es obligatorio')
      .test('required-if-not-edit', 'El documento es obligatorio', function (value) {
        if (!isEdit.value && !value) {
          return this.createError({ message: 'El documento es obligatorio' })
        }
        return true
      })
      .test('is-valid-type', 'No es un tipo de archivo válido', (value) => {
        if (!isEdit.value && value) {
          return isValidFileType(value && value.name.toLowerCase(), 'document')
        }
        return true
      }),
    // .test('is-valid-size', 'El tamaño máximo permitido es 100KB', (value) => {
    //   if (!isEdit.value && value) {
    //     return value.size <= 102400;
    //   }
    //   return true;
    // }),
    idObjeto: yup.string(),
  }),
})

const [numeroCapitulo] = defineField('numeroCapitulo', {
  validateOnModelUpdate: true,
})

const [rutaPDF] = defineField('rutaPDF', {
  validateOnModelUpdate: true,
})

const [idObjeto] = defineField('idObjeto', {
  validateOnModelUpdate: true,
})

const dataForm = reactive({
  numeroCapitulo: numeroCapitulo,
  rutaPDF: rutaPDF,
  idObjeto: idObjeto,
})

const handleSubmitForm = handleSubmit((values: FormValues) => {
  //validaciones
  if (!isEdit.value) {
    capituloStore.create(values)
  } else {
    capituloStore.update(id.value, values)
  }
})

onMounted(async () => {
  await objetoStore.getAll()
  isEdit.value = route.fullPath.includes('editar')
  id.value = route.params.id as string
  if (isEdit.value) {
    await capituloStore.getById(id.value).then((response) => {
      Object.assign(dataForm, {
        ...response,
      })
    })
  } else {
    Object.assign(dataForm, {
      idObjeto: id.value,
    })
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
            label: 'Capítulo',
            placeholder: 'Número de capítulo',
            type: 'number',
            isRequired: true,
            model: 'numeroCapitulo',
          },
          {
            label: 'PDF',
            placeholder: 'PDF',
            type: 'file',
            isRequired: true,
            model: 'rutaPDF',
          },
          {
            label: 'Objeto',
            placeholder: 'Objeto',
            type: 'select',
            select: {
              data: objetoStore.list,
              paramKey: 'titulo',
              valueKey: 'id',
            },
            isRequired: isEdit,
            model: 'idObjeto',
            isDisabled: true,
          },
        ],
        titleButton: isEdit ? 'Editar' : 'Crear',
        isCanceled: true,
      }"
    >
      <template #headerForm>
        <h1 class="text-[var(--primary)] text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          {{ isEdit ? 'Editar' : 'Crear' }} Capítulo
        </h1>
      </template>
    </BaseForm>
  </div>
</template>
