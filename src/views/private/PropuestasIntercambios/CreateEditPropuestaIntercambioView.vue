<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import { usePropuestaIntercambioStore } from '@/stores/propuestaIntercambio'
import { useObjetoStore } from '@/stores/objeto'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { EstatusObjeto, EstatusPropuestaIntercambio } from '@/common/enums/enums'
import { enumFormat } from '@/utils/helper'
import { useAccountStore } from '@/stores/account'

const propuestaIntercambioStore = usePropuestaIntercambioStore()
const objetoStore = useObjetoStore()
const accountStore = useAccountStore()
const router = useRouter()
const isEdit = ref(false)
const id = ref('')
const tipoEstadoList = Object.values(EstatusPropuestaIntercambio)
const propuestasRealizadas = ref([])

const objetoList = computed(() => {
  return objetoStore.list.filter(
    (item) => item.estado == Object.values(EstatusObjeto).indexOf(EstatusObjeto.DISPONIBLE),
  )
})
const objetoSolicitado = computed(() => {
  const objetoOfertadoItem = objetoStore.list.find((item) => {
    return item.id == idObjetoOfertado.value
  })

  const idUsuarioOfertado = objetoOfertadoItem ? objetoOfertadoItem.idUsuario : null

  if (objetoOfertadoItem && !isEdit) {
    idObjetoSolicitado.value = null
  }

  return objetoStore.list.filter(
    (item) =>
      item.idUsuario !== idUsuarioOfertado &&
      item.estado == Object.values(EstatusObjeto).indexOf(EstatusObjeto.DISPONIBLE),
  )
})

const objetoOfertado = computed(() => {
  const objetoSolicitadoItem = objetoStore.list.find((item) => {
    return item.id == idObjetoSolicitado.value
  })

  const idUsuarioSocilitado = objetoSolicitadoItem ? objetoSolicitadoItem.idUsuario : null

  if (objetoSolicitadoItem && !isEdit) {
    idObjetoOfertado.value = null
  }

  const objetosFiltradosPorUsuario = objetoStore.list.filter((item) => {
    if (
      item.idUsuario == accountStore.user.idUsuario &&
      item.estado == Object.values(EstatusObjeto).indexOf(EstatusObjeto.DISPONIBLE)
    )
      return item
  })

  const objetosFiltradosNoOfertados = objetosFiltradosPorUsuario.filter((objeto) => {
    return !propuestasRealizadas.value.some((propuesta) => {
      return propuesta.idObjetoOfertado == objeto.id
    })
  })

  return objetosFiltradosNoOfertados
})

const disableObjetoSolicitado = computed(() => {
  return objetoSolicitado.value.length === 0
})


const route = useRoute()
const isCreateIntercambiadorRoute = computed(() => {
  return route.name == 'crear propuesta intercambio intercambiador'
})

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    idObjetoOfertado: yup.string().required('El objeto ofertado es obligatorio'),
    idObjetoSolicitado: yup
      .string()
      .notOneOf([yup.ref('idObjetoOfertado')], 'Los objetos no pueden ser los mismo')
      .required('El objeto solicitado es obligatorio'),
    estado: yup.string().required('El estado es obligatorio'),
  }),
})

const [idObjetoOfertado] = defineField('idObjetoOfertado', {
  validateOnModelUpdate: true,
})

const [idObjetoSolicitado] = defineField('idObjetoSolicitado', {
  validateOnModelUpdate: true,
})

const [estado] = defineField('estado', { validateOnModelUpdate: true })

const dataForm = reactive({
  idObjetoOfertado: idObjetoOfertado,
  idObjetoSolicitado: idObjetoSolicitado,
  estado: estado,
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
    if (id.value) {
      if (accountStore.user.idUsuario) {
        await propuestaIntercambioStore
          .getAllByIdUsuarioAndIdObjeto(accountStore.user.idUsuario, parseInt(id.value))
          .then((response) => {
            if (response.success) {
              propuestasRealizadas.value = response.data
            }
          })
      }

      await objetoStore.getById(id.value).then((response) => {
        response.idUsuario == accountStore.user.idUsuario ? router.back() : ''
      })

      if (isCreateIntercambiadorRoute.value) {
        Object.assign(dataForm, {
          idObjeto: id.value,
          idObjetoSolicitado: id.value,
          estado: Object.values(EstatusPropuestaIntercambio).indexOf(
            EstatusPropuestaIntercambio.ENVIADA,
          ),
        })
      } else {
        Object.assign(dataForm, {
          idObjeto: id.value,
          estado: Object.values(EstatusPropuestaIntercambio).indexOf(
            EstatusPropuestaIntercambio.ENVIADA,
          ),
        })
      }
    } else {
      if (isCreateIntercambiadorRoute.value) {
        Object.assign(dataForm, {
          estado: Object.values(EstatusPropuestaIntercambio).indexOf(
            EstatusPropuestaIntercambio.ENVIADA,
          ),
        })
      } else {
        Object.assign(dataForm, {
          estado: Object.values(EstatusPropuestaIntercambio).indexOf(
            EstatusPropuestaIntercambio.ENVIADA,
          ),
        })
      }
    }
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
              data: isCreateIntercambiadorRoute ? objetoOfertado : objetoList,
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
              data: isCreateIntercambiadorRoute ? objetoList : objetoSolicitado,
              paramKey: 'nombre',
              valueKey: 'id',
            },
            isRequired: isEdit,
            isDisabled: isCreateIntercambiadorRoute || disableObjetoSolicitado.valueOf(),
            model: 'idObjetoSolicitado',
          },
          {
            label: 'Estatus',
            placeholder: 'Estatus de la propuesta',
            type: 'select',
            select: {
              data: enumFormat(tipoEstadoList),
              paramKey: 'name',
              valueKey: 'id',
            },
            isRequired: true,
            isDisabled: true,
            model: 'estado',
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
    <div v-if="disableObjetoSolicitado" class="mt-2 text-red-600 text-sm">
      No hay objetos disponibles para realizar el intercambio.
    </div>
  </div>
</template>
