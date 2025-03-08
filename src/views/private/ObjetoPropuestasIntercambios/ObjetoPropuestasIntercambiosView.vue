<script setup lang="ts">
import { useCapituloStore } from '@/stores/propuestaIntercambio'
import { useObjetoStore } from '@/stores/objeto'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
import BaseTable from '@/components/BaseTable.vue'
import BaseModal from '@/components/BaseModal.vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'

const capituloStore = useCapituloStore()
const objetoStore = useObjetoStore()

const isOpen = ref(false)
const baseUrl = import.meta.env.VITE_APP_URL_API_SOURCE
const srcPDF = ref('')
const objeto = ref({})
const breadcrumbItems = [{ label: 'Buscador', route: '/buscador' }, { label: 'Capítulos' }]

function openModal(src: string) {
  srcPDF.value = baseUrl + src.replace('\\', '/')
  isOpen.value = true
}

function download(src: string) {
  fetch(`${baseUrl}${src}`)
    .then((response) => {
      if (!response.ok) throw new Error(`Error ${response.status}: No se pudo descargar`)

      return response.body
    })
    .then(async (stream) => {
      if (!stream) throw new Error('No se pudo obtener el stream')

      const reader = stream.getReader()
      const chunks: Uint8Array[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }

      const blob = new Blob(chunks, { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = src.split('/').pop() || 'archivo.pdf'
      link.click()
      URL.revokeObjectURL(url)
    })
    .catch((error) => {
      console.error('Error al descargar:', error)
    })
}

onMounted(async () => {
  const idObjeto = route.params.id as string
  await capituloStore.getAllByIdObjeto(idObjeto)
  objeto.value = await objetoStore.getById(idObjeto)
})
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
            icon: 'pi-download',
            type: 'action',
            action: (row) => download(row.rutaPDF),
            styleType: 'primary',
          },
        ],
      }"
    />

    <BaseModal v-model:open="isOpen" :isPDF="true">
      <iframe :src="srcPDF" class="h-full w-full" />
    </BaseModal>
  </div>
</template>
