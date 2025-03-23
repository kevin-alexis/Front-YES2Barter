<script setup lang="ts">
import ObjetoItemDetalle from '@/components/Objeto/ObjetoItemDetalle.vue'
import PropuestaIntercambioList from '@/components/PropuestaIntercambio/PropuestaIntercambioList.vue'
import PerfilDetallesItem from '@/components/Perfil/PerfilDetallesItem.vue'
import { useRoute } from 'vue-router'
import { useAccountStore } from '@/stores/account'
import { usePersonaStore } from '@/stores/persona'
import { computed, onBeforeMount, reactive, ref } from 'vue'
import { useObjetoStore } from '@/stores/objeto'
import BaseButton from '@/components/BaseButton.vue'
import { usePropuestaIntercambioStore } from '../../../stores/propuestaIntercambio'
import type { IObjeto } from '@/interfaces/objeto/IObjeto'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import { EstatusPropuestaIntercambio } from '@/common/enums/enums'

const route = useRoute()
const objetoStore = useObjetoStore()
const accountStore = useAccountStore()
const personaStore = usePersonaStore()
const propuestaIntercambioStore = usePropuestaIntercambioStore()
const objeto = reactive<IObjeto>({
  id: 0,
  nombre: '',
  descripcion: '',
  idCategoria: 0,
  fechaPublicacion: new Date(),
  estado: 0,
  rutaImagen: '',
  idUsuario: '',
  esBorrado: false,
})

const id = ref('')
const isDueño = ref(false)
const isAvailable = ref(true)
const noTieneObjetos = ref(false)
const isLoading = ref(true)
const propuestas = computed(() => {
  return propuestaIntercambioStore.list.filter(
    (item) => item.idObjetoOfertado != parseInt(id.value),
  )
})

const propuestasRealizadas = ref([])
const propuestasTotalesDelObjeto = ref([])

const propuestasRealizadasFiltradas = computed(() => {
  return propuestasTotalesDelObjeto.value.filter(item =>{
    return (item.idUsuarioOfertante == accountStore.user.idUsuario
     || item.idUsuarioReceptor == accountStore.user.idUsuario && item.estado == EstatusPropuestaIntercambio.ENVIADA)
  });
});


onBeforeMount(async () => {
  id.value = route.params.id as string
  const response = await objetoStore.getById(id.value)
  await accountStore.getUser()
  await personaStore.getPersonaByIdUsuario(response.idUsuario)
  await objetoStore.getAllByIdUsuario(accountStore?.user?.idUsuario ?? '')
  await propuestaIntercambioStore
    .getAllByIdUsuarioAndIdObjeto(accountStore?.user?.idUsuario ?? '', parseInt(id.value))
    .then((response) => {
      if (response.success) {
        isAvailable.value = response.data.length < objetoStore.list.length
        propuestasRealizadas.value = response.data
      }else{
        if(objetoStore.list.length == 0){
          isAvailable.value = false
          noTieneObjetos.value = true
        }
      }
    })
    await propuestaIntercambioStore
    .getAllByIdObjeto(id.value)
    .then(() => {
      propuestasTotalesDelObjeto.value = propuestaIntercambioStore.list
    })
  Object.assign(objeto, response)
  if (objeto?.idUsuario == accountStore?.user?.idUsuario) {
    isDueño.value = true
    await propuestaIntercambioStore.getAllByIdObjeto(objeto.id.toString())
  }
  isLoading.value = false
})
</script>

<template>
  <div :class="[
    'flex flex-col md:flex-row justify-between w-full',
    isLoading ? 'justify-center items-center' : ''
  ]">
    <ProgressSpinner
      v-if="isLoading"
      style="width: 50px; height: 50px;"
      strokeWidth="8"
      fill="transparent"
      animationDuration=".5s"
      aria-label="Custom ProgressSpinner"
    />

    <div v-else class="flex flex-col md:flex-row justify-between w-full">
      <div class="w-full md:w-1/2">
        <ObjetoItemDetalle class="w-full" />
      </div>

      <div class="w-full md:w-1/2  md:overflow-y-scroll">
        <div class="px-7 pt-6" v-if="noTieneObjetos">
          <Message severity="warn" closable>¡Ups! Aún no tienes objetos. Crea uno para poder hacer ofertas.</Message>
        </div>

        <div class="w-full">
          <PerfilDetallesItem
          v-if="!isDueño"
          :config="{
            persona: personaStore.persona,
            isEditable: false,
          }"
        ></PerfilDetallesItem>
        </div>

        <div class="px-7" v-if="!isDueño && isAvailable">
          <RouterLink
            :to="{ name: 'crear propuesta intercambio intercambiador', params: { id: id } }"
          >
            <BaseButton style-type="primary">Hacer una propuesta</BaseButton>
          </RouterLink>
        </div>

        <div :class="[!isDueño ? 'h-10/12 ' : 'h-1/2 ']">
          <PropuestaIntercambioList
            :propuestasIntercambios="isDueño ? propuestas : propuestasRealizadasFiltradas"
            :isInteractive="isDueño"
          ></PropuestaIntercambioList>
        </div>
      </div>
    </div>
  </div>
</template>
