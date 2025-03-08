<script setup lang="ts">
import BaseTable from '@/components/BaseTable.vue'
import { useCapituloStore } from '@/stores/propuestaIntercambio'
import { useObjetoStore } from '@/stores/objeto'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseModal from '@/components/BaseModal.vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'

const capituloStore = useCapituloStore()
const objetoStore = useObjetoStore()
const route = useRoute()
const isOpen = ref(false)
const baseUrl = import.meta.env.VITE_APP_URL_API_SOURCE
const srcPDF = ref('')
const objeto = ref({})

const breadcrumbItems = [
  { label: 'Categorias', route: '/categoria' },
  { label: 'Objetos', route: 'back' },
  { label: 'Capítulos' },
]

onMounted(async () => {
  const idObjeto = route.params.id as string
  await capituloStore.getAllByIdObjeto(idObjeto)
  objeto.value = await objetoStore.getById(idObjeto)
})

function openModal(src: string) {
  srcPDF.value = baseUrl + src.replace('\\', '/')
  isOpen.value = true
}
</script>

<template>
  <div>
    <BreadcrumbComponent :items="breadcrumbItems" />
    <BaseTable
      :config="{
        title: `Capitulos del objeto: ${objeto?.titulo ?? ''}`,
        agregar: { name: 'crear capitulo', paramKey: 'id' },
        columns: [
          {
            name: 'Capítulo',
            nameData: 'numeroCapitulo',
          },
        ],
        data: capituloStore.list,
        buttons: [
          {
            title: '',
            icon: 'pi-file-pdf',
            type: 'action',
            action: (row) => openModal(row.rutaPDF),
            styleType: 'primary',
          },
          {
            title: '',
            icon: 'pi-pen-to-square',
            type: 'router',
            route: { name: 'editar capitulo', paramKey: 'id' },
            styleType: 'warning',
          },
          {
            title: '',
            icon: 'pi-trash',
            type: 'action',
            action: (row) => capituloStore.deleteItem(row.id),
            styleType: 'danger',
          },
        ],
      }"
    />

    <BaseModal v-model:open="isOpen" :isPDF="true">
      <iframe :src="srcPDF" class="h-full w-full" />
    </BaseModal>
  </div>
</template>
