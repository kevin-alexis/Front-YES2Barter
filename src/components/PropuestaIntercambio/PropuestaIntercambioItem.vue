<script setup lang="ts">
import { EstatusPropuestaIntercambio } from '@/common/enums/enums';
import { formatDateToView } from '../../utils/helper';
import BaseButton from '@/components/BaseButton.vue'
import Tag from 'primevue/tag';
import { usePropuestaIntercambioStore } from '@/stores/propuestaIntercambio';
import type { IPropuestaIntercambioWithDataPersona } from '@/interfaces/propuestaIntercambio/IPropuestaIntercambio';
import { useAccountStore } from '../../stores/account';

const URL_API_SOURCE = import.meta.env.VITE_APP_URL_API_SOURCE;
const propuestaIntercambioStore = usePropuestaIntercambioStore()
const props = defineProps<{
  propuestaIntercambio: IPropuestaIntercambioWithDataPersona;
  isInteractive:boolean
}>();
const accountStore = useAccountStore()
const isOfertante = props.propuestaIntercambio.idUsuarioOfertante ==  accountStore?.user?.idUsuario;

function cerrarPropuestaIntercambio(id: number, isSuccess: boolean){
  propuestaIntercambioStore.acceptOrDeclinePropuestaIntercambio(id, isSuccess);
}

</script>

<template>
  <div class="flex flex-wrap items-center bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto mb-6 hover:shadow-xl transition-shadow duration-300">
    <!-- <RouterLink :to="{ name: 'consultar detalles objeto', params: { id: propuestaIntercambio.objetoOfertado.id } }" -->
    <div class="flex flex-wrap items-center w-full max-w-4xl mx-auto">
      <div class="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden mr-6 mb-6 sm:mb-0">
      <img
        :src="URL_API_SOURCE + (

          isInteractive ?
      props.propuestaIntercambio.objetoOfertado.rutaImagen
      : isOfertante ?
      props.propuestaIntercambio.objetoOfertado.rutaImagen
      : props.propuestaIntercambio.objetoSolicitado.rutaImagen)"
        class="w-full h-full object-cover"
        alt="Imagen del objeto ofertado"
      />
      </div>

    <div class="flex-1">
      <p class="font-semibold text-xl text-gray-800 mb-1">{{
      isInteractive ?
      props.propuestaIntercambio.objetoOfertado.nombre
      : isOfertante ?
      props.propuestaIntercambio.objetoOfertado.nombre
      : props.propuestaIntercambio.objetoSolicitado.nombre  }}</p>
      <p class="font-light text-sm text-gray-800 mb-1">{{
      isInteractive ?
      props.propuestaIntercambio.objetoOfertado.descripcion
      : isOfertante ?
      props.propuestaIntercambio.objetoOfertado.descripcion
      : props.propuestaIntercambio.objetoSolicitado.descripcion }}</p>
      <p class="text-xs text-gray-500">{{ formatDateToView(props.propuestaIntercambio.objetoOfertado.fechaPublicacion) }}</p>
      <div class="flex flex-wrap gap-2 mt-3">
            <Tag
              class="text-sm font-semibold"
              :value="Object.values(EstatusPropuestaIntercambio)[props.propuestaIntercambio.estado]"
              severity="info"
            />
          </div>
    </div>

    <div class="flex items-center ml-6 mb-6 sm:mb-0">
      <img
        :src="URL_API_SOURCE + (props.propuestaIntercambio.personaOfertante.rutaFotoPerfil)"
        alt="Foto de perfil ofertante"
        class="h-12 w-12 rounded-full border-2 border-gray-300 shadow-sm object-cover"
      />
      <div class="ml-3">
        <p class="font-medium text-gray-800">Ofertante:</p>
        <p class="text-sm text-gray-600">{{ props.propuestaIntercambio.personaOfertante.nombre }}</p>
      </div>
    </div>

    <div class="flex items-center ml-6 mb-6 sm:mb-0">
      <img
        :src="URL_API_SOURCE + props.propuestaIntercambio.personaReceptor.rutaFotoPerfil"
        alt="Foto de perfil receptor"
        class="h-12 w-12 rounded-full border-2 border-gray-300 shadow-sm object-cover"
      />
      <div class="ml-3">
        <p class="font-medium text-gray-800">Receptor:</p>
        <p class="text-sm text-gray-600">{{ props.propuestaIntercambio.personaReceptor.nombre }}</p>
      </div>
    </div>
  </div>

    <div class="w-full flex gap-4 justify-center sm:justify-start mt-4" v-if="isInteractive && props.propuestaIntercambio.estado == Object.values(EstatusPropuestaIntercambio).indexOf(EstatusPropuestaIntercambio.ENVIADA)">
      <BaseButton styleType="success" class="w-24 py-2"
      @click="cerrarPropuestaIntercambio(props.propuestaIntercambio.id, true)" tooltip=""
      >
        <i class="pi pi-check text-white"></i>
        Aceptar
      </BaseButton>
      <BaseButton styleType="danger" class="w-24 py-2"
      @click="cerrarPropuestaIntercambio(props.propuestaIntercambio.id, false)" tooltip=""
      >
        <i class="pi pi-times text-white"></i>
        Rechazar
      </BaseButton>
    </div>

  </div>
</template>

