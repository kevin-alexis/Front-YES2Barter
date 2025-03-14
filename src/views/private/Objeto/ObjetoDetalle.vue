<script setup lang="ts">
import ObjetoItemDetalle from '@/components/Objeto/ObjetoItemDetalle.vue'
import PropuestaIntercambioList from '@/components/PropuestaIntercambio/PropuestaIntercambioList.vue'
import PerfilDetallesItem from '@/components/Perfil/PerfilDetallesItem.vue';
import { useRoute } from 'vue-router'
import { useAccountStore } from '@/stores/account'
import { usePersonaStore } from '@/stores/persona';
import { onBeforeMount, reactive } from 'vue';
import { useObjetoStore } from '@/stores/objeto';
import type { IObjeto } from '@/interfaces/objeto/IObjeto';
import BaseButton from '@/components/BaseButton.vue';
import { usePropuestaIntercambioStore } from '../../../stores/propuestaIntercambio';

const route = useRoute()
const objetoStore = useObjetoStore()
const accountStore = useAccountStore()
const personaStore = usePersonaStore()
const propuestaIntercambioStore = usePropuestaIntercambioStore()
const objeto = reactive({});

onBeforeMount(async () => {
  const id = route.params.id as string;
  const response = await objetoStore.getById(id);
  await accountStore.getUser();
  await personaStore.getPersonaByIdUsuario(response.idUsuario);
  Object.assign(objeto, response);
  if(objeto?.idUsuario == accountStore?.user?.uid){
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
      <!-- ! LO DESACTIVE PORQUE CAUSA ERRORES CON LAS RUTAS -->
      <PropuestaIntercambioList v-if="objeto?.idUsuario == accountStore?.user?.uid"
      :propuestasIntercambios="propuestaIntercambioStore.list"
      ></PropuestaIntercambioList>
      <PerfilDetallesItem
        v-else
        :config="{
          persona: personaStore.persona,
          isEditable: false
        }"
      ></PerfilDetallesItem>

      <div class="p-5" v-if="objeto?.idUsuario != accountStore?.user?.uid">
        <RouterLink :to="{name: 'crear propuesta intercambio'}">
          <BaseButton style-type="primary">Hacer una propuesta</BaseButton>
        </RouterLink>
      </div>

    </div>
  </div>
</template>
