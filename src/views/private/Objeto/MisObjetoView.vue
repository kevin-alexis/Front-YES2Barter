<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import ObjetoList from '@/components/Objeto/ObjetoList.vue'
import { useObjetoStore } from '@/stores/objeto'
import { useAccountStore } from '@/stores/account'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'

const objetoStore = useObjetoStore()
const accountStore = useAccountStore()

const isLoading = ref(true)

onBeforeMount(() => {
  objetoStore.getAllByIdUsuario(accountStore.user.idUsuario)
  isLoading.value = false
})
</script>

<template>
  <div>
    <div v-if="isLoading" class="loading-message max-h-screen flex justify-center items-center">
      <div>
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-light text-center">Cargando objetos...</h1>
      </div>
    </div>

    <div v-else class="w-full max-h-screen overflow-y-auto p-2">
      <div class="flex justify-end my-3">
        <RouterLink :to="{ name: 'crear objeto' }">
          <Button class="p-button-general" label="Agregar" icon="pi pi-plus" />
        </RouterLink>
      </div>
      <ObjetoList
        v-model:objetos="objetoStore.list"
        :config="{
          showButtons: true,
        }"
      ></ObjetoList>
    </div>
  </div>
</template>
