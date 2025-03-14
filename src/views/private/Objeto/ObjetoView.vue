
<script setup lang="ts">
import ObjetoCrudView from '@/views/private/Objeto/ObjetoCrudView.vue';
import MisObjetoView from '@/views/private/Objeto/MisObjetoView.vue';


import { useAccountStore } from "@/stores/account";
import { onMounted } from 'vue';
const accountStore = useAccountStore()

onMounted(()=>{
  accountStore.getUser()
})

</script>


<template>
  <main>
    <ObjetoCrudView
      class="p-5"
      v-if="accountStore.isLoggedIn && accountStore.user && accountStore.user.rol === 'Administrador'">
  </ObjetoCrudView>

    <MisObjetoView
      class="p-5"
      v-else-if="accountStore.isLoggedIn && accountStore.user && accountStore.user.rol !== 'Administrador'">
    </MisObjetoView>

  </main>
</template>

