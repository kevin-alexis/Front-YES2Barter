<script setup lang="ts">
import ObjetoItemDetalle from '@/components/Objeto/ObjetoItemDetalle.vue'
import PropuestaIntercambioList from '@/components/PropuestaIntercambio/PropuestaIntercambioList.vue'
import PerfilDetallesItem from '@/components/Perfil/PerfilDetallesItem.vue';
import { useRoute } from 'vue-router'
import { useAccountStore } from '@/stores/account'
import { usePersonaStore } from '@/stores/persona';
import { onBeforeMount, reactive, ref } from 'vue';
import { useObjetoStore } from '@/stores/objeto';
import BaseButton from '@/components/BaseButton.vue';
import { usePropuestaIntercambioStore } from '../../../stores/propuestaIntercambio';

const route = useRoute()
const objetoStore = useObjetoStore()
const accountStore = useAccountStore()
const personaStore = usePersonaStore()
const propuestaIntercambioStore = usePropuestaIntercambioStore()
const objeto = reactive({});
const id = ref('')
const isDueño = ref(false)

onBeforeMount(async () => {
  id.value = route.params.id as string;
  const response = await objetoStore.getById(id.value);
  await accountStore.getUser();
  await personaStore.getPersonaByIdUsuario(response.idUsuario);
  Object.assign(objeto, response);
  if(objeto?.idUsuario == accountStore?.user?.idUsuario){
    isDueño.value = true;
    propuestaIntercambioStore.getAllByIdObjeto(objeto.id)
  }
})
</script>

<template>
  <div class="flex flex-col md:flex-row justify-between w-full">
    <div class="w-full md:w-1/2">
      <ObjetoItemDetalle class="w-full"/>
    </div>

    <div class="w-full md:w-1/2">
      <PropuestaIntercambioList v-if="isDueño"
      :propuestasIntercambios="propuestaIntercambioStore.list"
      ></PropuestaIntercambioList>
      <PerfilDetallesItem
        v-else
        :config="{
          persona: personaStore.persona,
          isEditable: false
        }"
      ></PerfilDetallesItem>

      <div class="p-5" v-if="!isDueño">
        <RouterLink :to="{name: 'crear propuesta intercambio intercambiador', params: { id: id}}">
          <BaseButton style-type="primary">Hacer una propuesta</BaseButton>
        </RouterLink>
      </div>

    </div>
  </div>
</template>
