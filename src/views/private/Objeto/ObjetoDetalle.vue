<script setup lang="ts">
import ObjetoItemDetalle from '@/components/Objeto/ObjetoItemDetalle.vue'
import PropuestaIntercambioList from '@/components/PropuestaIntercambio/PropuestaIntercambioList.vue'

const objeto: any = defineModel('objeto')

</script>

<template>
  <div class="flex justify-between">
    <div>
      <ObjetoItemDetalle
        :objeto="objeto"
        class="w-full"
      />
    </div>
    <div>
      Aqui va a ir un componente que te regrese segun el usuario su info de otro usuario o las solicitudes de intercambio si es su producto
      <PropuestaIntercambioList></PropuestaIntercambioList>
      <PerfilDetalles></PerfilDetalles>
    </div>
  </div>
</template>
