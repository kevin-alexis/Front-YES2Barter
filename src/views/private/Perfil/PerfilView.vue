<script setup lang="ts">
import PerfilDetallesItem from '@/components/Perfil/PerfilDetallesItem.vue';

import { useAccountStore } from '@/stores/account'
import { usePersonaStore } from '@/stores/persona';
import { onBeforeMount } from 'vue';


const accountStore = useAccountStore()
const personaStore = usePersonaStore()

onBeforeMount(async () => {
  await personaStore.getPersonaByIdUsuario(accountStore.user.idUsuario);
})

</script>

<template>
  <div>
    <PerfilDetallesItem
    :config="{
      persona: personaStore.persona,
      isEditable: true
    }"
    ></PerfilDetallesItem>
  </div>
</template>
