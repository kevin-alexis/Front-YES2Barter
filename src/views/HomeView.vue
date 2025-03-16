<script setup lang="ts">
import InicioNoLogeado from '@/components/Inicio/InicioNoLogeado.vue';
import InicioLogeado from '@/components/Inicio/InicioLogeado.vue';
import DashboardAdmin from '@/components/Inicio/DashboardAdmin.vue';

import { useAccountStore } from "@/stores/account";
import { onMounted } from 'vue';
const accountStore = useAccountStore()

onMounted(()=>{
})

</script>


<template>
  <main>
    <DashboardAdmin
      class="p-5"
      v-if="accountStore.isLoggedIn && accountStore.user && accountStore.user.rol === 'Administrador'">
    </DashboardAdmin>

    <InicioLogeado
      class="p-5"
      v-else-if="accountStore.isLoggedIn && accountStore.user && accountStore.user.rol !== 'Administrador'">
    </InicioLogeado>

    <InicioNoLogeado v-else></InicioNoLogeado>
  </main>
</template>

