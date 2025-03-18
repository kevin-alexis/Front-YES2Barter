<script setup lang="ts">
import ObjetoCrudView from '@/views/private/Objeto/ObjetoCrudView.vue'
import MisObjetoView from '@/views/private/Objeto/MisObjetoView.vue'
import { useAccountStore } from '@/stores/account'
import { onMounted, ref } from 'vue'

const accountStore = useAccountStore()
const isAdmin = ref(false)

onMounted(() => {
  isAdmin.value = (accountStore.isLoggedIn && accountStore.user && accountStore.user.rol === 'Administrador')
})

</script>

<template>
  <div>
    <ObjetoCrudView class="p-5" v-if="isAdmin"></ObjetoCrudView>

    <MisObjetoView class="p-5" v-else></MisObjetoView>
  </div>
</template>
