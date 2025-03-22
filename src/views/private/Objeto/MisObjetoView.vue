<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import ObjetoList from '@/components/Objeto/ObjetoList.vue'
import { useObjetoStore } from '@/stores/objeto'
import { useAccountStore } from '@/stores/account'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

const objetoStore = useObjetoStore()
const accountStore = useAccountStore()

const isLoading = ref(true)

onBeforeMount(async () => {
  try {
    await objetoStore.getAllByIdUsuario(accountStore?.user?.idUsuario ?? "")
  } catch (error) {
    console.error('Error al cargar los objetos:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div :class="[isLoading ? 'flex justify-center items-center h-full': '']">
    <div v-if="isLoading" class="loading-message max-h-screen flex justify-center items-center">
      <ProgressSpinner
      style="width: 50px; height: 50px"
      strokeWidth="8"
      fill="transparent"
      animationDuration=".5s"
      aria-label="Custom ProgressSpinner"
    />
    </div>

    <div v-else class="w-full max-h-screen p-2">
      <div class="flex justify-end my-3">
        <RouterLink :to="{ name: 'crear objeto' }">
          <Button class="p-button-general" label="Agregar" icon="pi pi-plus" />
        </RouterLink>
      </div>
      <div class="overflow-y-auto">
        <ObjetoList
        v-model:objetos="objetoStore.list"
        :config="{
          showButtons: true,
          message: '¡Ups! Aún no tienes objetos. Empieza a crear y administrar tus objetos aquí.'
        }"
      ></ObjetoList>
      </div>

    </div>
  </div>
</template>
