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
import { EstatusPropuestaIntercambio } from '@/common/enums/enums'

const route = useRoute()
const objetoStore = useObjetoStore()
const accountStore = useAccountStore()
const personaStore = usePersonaStore()
const propuestaIntercambioStore = usePropuestaIntercambioStore()
const objeto = reactive({})
const id = ref('')
const isDueño = ref(false)
const isAvailable = ref(true)
const propuestas = computed(() => {
  return propuestaIntercambioStore.list.filter(
    (item) => item.idObjetoOfertado != parseInt(id.value),
  )
})

const propuestasRealizadas = ref([])

onBeforeMount(async () => {
  id.value = route.params.id as string
  const response = await objetoStore.getById(id.value)
  await accountStore.getUser()
  await personaStore.getPersonaByIdUsuario(response.idUsuario)
  await objetoStore.getAllByIdUsuario(accountStore?.user?.idUsuario)
  await propuestaIntercambioStore
    .getAllByIdUsuarioAndIdObjeto(accountStore?.user?.idUsuario, parseInt(id.value))
    .then((response) => {
      if (response.success) {
        isAvailable.value = response.data.length < objetoStore.list.length
        propuestasRealizadas.value = response.data
      } else {
        console.log(response.data)
        console.log(response.message)
      }
    })

  Object.assign(objeto, response)
  if (objeto?.idUsuario == accountStore?.user?.idUsuario) {
    isDueño.value = true
    await propuestaIntercambioStore.getAllByIdObjeto(objeto.id)
  }
})
</script>

<template>
  <div class="flex flex-col md:flex-row justify-between w-full">
    <div class="w-full md:w-1/2">
      <ObjetoItemDetalle class="w-full" />
    </div>

    <div class="w-full md:w-1/2">
      <PerfilDetallesItem
        v-if="!isDueño"
        :config="{
          persona: personaStore.persona,
          isEditable: false,
        }"
      ></PerfilDetallesItem>

      <div class="p-5" v-if="!isDueño && isAvailable">
        <RouterLink
          :to="{ name: 'crear propuesta intercambio intercambiador', params: { id: id } }"
        >
          <BaseButton style-type="primary">Hacer una propuesta</BaseButton>
        </RouterLink>
      </div>

      <div :class="[!isDueño ?'h-10/12 overflow-y-scroll' : 'h-1/2 overflow-y-scroll']">
        <PropuestaIntercambioList
          :propuestasIntercambios="isDueño ? propuestas : propuestasRealizadas"
          :isInteractive="isDueño"
        ></PropuestaIntercambioList>
      </div>
    </div>
  </div>
</template>
