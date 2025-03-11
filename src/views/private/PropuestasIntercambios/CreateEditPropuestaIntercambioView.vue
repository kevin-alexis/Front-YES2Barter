<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import { usePropuestaIntercambioStore } from '@/stores/propuestaIntercambio'
import { useObjetoStore } from '@/stores/objeto'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import * as yup from 'yup'
import { useForm } from 'vee-validate'

const propuestaIntercambioStore = usePropuestaIntercambioStore()
const objetoStore = useObjetoStore()
const isEdit = ref(false)
const id = ref('')

const route = useRoute()

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    idObjetoOfertado: yup.string().required('El objeto ofertado es obligatorio'),
    idObjetoSolicitado: yup
    .string()
    .notOneOf([yup.ref('idObjetoOfertado')], 'Los objetos no pueden ser los mismo')
    .required('El objeto solicitado es obligatorio'),
    confirmarPassword: yup
      .string()
  }),
})

const [idObjetoOfertado] = defineField('idObjetoOfertado', {
  validateOnModelUpdate: true,
})

const [idObjetoSolicitado] = defineField('idObjetoSolicitado', {
  validateOnModelUpdate: true,
})

const dataForm = reactive({
  idObjetoOfertado: idObjetoOfertado,
  idObjetoSolicitado: idObjetoSolicitado,
})

const handleSubmitForm = handleSubmit((values: FormValues) => {
  //validaciones
  if (!isEdit.value) {
    propuestaIntercambioStore.create(values)
  } else {
    propuestaIntercambioStore.update(id.value, values)
  }
})

onMounted(async () => {
  await objetoStore.getAll()
  isEdit.value = route.fullPath.includes('editar')
  id.value = route.params.id as string
  if (isEdit.value) {
    await propuestaIntercambioStore.getById(id.value).then((response) => {
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
            label: 'Objeto Ofertado',
            placeholder: 'Objeto',
            type: 'select',
            select: {
              data: objetoStore.list,
              paramKey: 'nombre',
              valueKey: 'id',
            },
            isRequired: isEdit,
            model: 'idObjetoOfertado',
          },
          {
            label: 'Objeto Solicitado',
            placeholder: 'Objeto',
            type: 'select',
            select: {
              data: objetoStore.list,
              paramKey: 'nombre',
              valueKey: 'id',
            },
            isRequired: isEdit,
            model: 'idObjetoSolicitado',
          },
        ],
        titleButton: isEdit ? 'Editar' : 'Crear',
        isCanceled: true,
      }"
    >
      <template #headerForm>
        <h1 class="text-[var(--primary)] text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          {{ isEdit ? 'Editar' : 'Crear' }} Propuesta de Intercambio
        </h1>
      </template>
    </BaseForm>
  </div>
</template>
