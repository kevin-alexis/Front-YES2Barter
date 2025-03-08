<script setup lang="ts">
import { onMounted } from 'vue'
import ObjetoList from '@/components/Objeto/ObjetoList.vue'
import { useObjetoStore } from '@/stores/objeto'

const objetoStore = useObjetoStore()

onMounted(async () => {
  await objetoStore.getAll()
})
</script>
<template>
  <div>
    <!-- MIS OBJETOS MANDO A LLAMAR UN COMPONENTE DE OBJECT LIST -->
     <strong>ESTOS SON LOS OBJETOS DEL USUARIO</strong>
     <p>     PARA EDITAR ELIMINAR Y ASI SE REUTILIZARA LA VISTA DE CREATEEDITOBJECT DEL ADMIN</p>

     <div class="w-full max-h-[450px] overflow-y-auto">
        <ObjetoList v-model:objetos="objetoStore.list"></ObjetoList>
      </div>
  </div>
</template>
