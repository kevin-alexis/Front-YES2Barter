<script setup lang="ts">
import BaseTable from '@/components/BaseTable.vue'
import { useObjetoStore } from '@/stores/objeto'
import { useCategoriaStore } from '@/stores/categoria'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseModal from '@/components/BaseModal.vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'

const objetoStore = useObjetoStore()
const categoriaStore = useCategoriaStore()
const route = useRoute()
const isOpen = ref(false)
const baseUrl = import.meta.env.VITE_APP_URL_API_SOURCE
const srcImage = ref('')
const categoria = ref({})

const breadcrumbItems = [{ label: 'Categorías', route: '/categoria' }, { label: 'Objetos' }]

onMounted(async () => {
  const idCategoria = route.params.id as string
  await objetoStore.getAllByIdCategoria(idCategoria)
  categoria.value = await categoriaStore.getById(idCategoria)
})

function openModal(src: string) {
  srcImage.value = baseUrl + src.replace('\\', '/')
  isOpen.value = true
}
</script>

<template>
  <div>
    <BreadcrumbComponent :items="breadcrumbItems" />
    <BaseTable
      :config="{
        title: `Objetos del categoria: ${categoria?.nombre ?? ''}`,
        agregar: { name: 'crear objeto', paramKey: 'id' },
        columns: [
          {
            name: 'Título',
            nameData: 'titulo',
          },
          {
            name: 'Descripción',
            nameData: 'descripcion',
          },
          {
            name: 'Año de publicación',
            nameData: 'fechaPublicacion',
          },
        ],
        data: objetoStore.list,
        buttons: [
          {
            title: '',
            icon: 'pi-image',
            type: 'action',
            action: (row) => openModal(row.rutaImagen),
            styleType: 'primary',
          },
          {
            title: '',
            icon: 'pi-list',
            type: 'router',
            route: { name: 'administrar capitulos', paramKey: 'id' },
            styleType: 'warning',
          },
          {
            title: '',
            icon: 'pi-pen-to-square',
            type: 'router',
            route: { name: 'editar objeto', paramKey: 'id' },
            styleType: 'warning',
          },
          {
            title: '',
            icon: 'pi-trash',
            type: 'action',
            action: (row) => objetoStore.deleteItem(row.id),
            styleType: 'danger',
          },
        ],
      }"
    />

    <BaseModal v-model:open="isOpen" :isPDF="false">
      <img :src="srcImage" class="h-full w-auto object-cover" />
    </BaseModal>
  </div>
</template>
