<script setup lang="ts">
// import BaseTable from '@/components/BaseTable.vue'
import { usePropuestaIntercambioStore } from '@/stores/propuestaIntercambio'
import { useObjetoStore } from '@/stores/objeto'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseModal from '@/components/BaseModal.vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from '@primevue/core/api';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

const propuestaIntercambioStore = usePropuestaIntercambioStore()
const objetoStore = useObjetoStore()
const route = useRoute()
const isOpen = ref(false)
const baseUrl = import.meta.env.VITE_APP_URL_API_SOURCE
const srcPDF = ref('')
const objeto = ref({})
const loading = ref(true);

const breadcrumbItems = [
  { label: 'Categorias', route: '/categoria' },
  { label: 'Objetos', route: 'back' },
  { label: 'Capítulos' },
]

onMounted(async () => {
  const idObjeto = route.params.id as string
  await propuestaIntercambioStore.getAllByIdObjeto(idObjeto)
  objeto.value = await objetoStore.getById(idObjeto)
  loading.value = false
})

function openModal(src: string) {
  srcPDF.value = baseUrl + src.replace('\\', '/')
  isOpen.value = true
}

const filters = ref({
  idUsuarioOfertante: { value: null, matchMode: FilterMatchMode.CONTAINS },
  idUsuarioReceptor: { value: null, matchMode: FilterMatchMode.CONTAINS },
  idObjetoOfertado: { value: null, matchMode: FilterMatchMode.EQUALS },
  idObjetoSolicitado: { value: null, matchMode: FilterMatchMode.EQUALS },
  fechaPropuesta: { value: null, matchMode: FilterMatchMode.EQUALS },
})
</script>

<template>
  <div>
    <BreadcrumbComponent :items="breadcrumbItems" />
    <!-- <BaseTable
      :config="{
        title: `Propuestas Intercambios del objeto: ${objeto?.titulo ?? ''}`,
        // agregar: { name: 'crear propuestas intercambios', paramKey: 'id' },
        columns: [
          {
            name: 'Capítulo',
            nameData: 'numeroCapitulo',
          },
        ],
        data: propuestaIntercambioStore.list,
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
            route: { name: 'editar propuesta intercambio', paramKey: 'id' },
            styleType: 'warning',
          },
          {
            title: '',
            icon: 'pi-trash',
            type: 'action',
            action: (row) => propuestaIntercambioStore.deleteItem(row.id),
            styleType: 'danger',
          },
        ],
      }"
    /> -->

    <DataTable v-model:filters="filters" :value="propuestaIntercambioStore.list" :loading="loading" paginator :rows="10" dataKey="id" :rowsPerPageOptions="[5, 10, 15]"
    :globalFilterFields="['idUsuarioOfertante', 'idUsuarioReceptor', 'idObjetoOfertado', 'idObjetoSolicitado', 'fechaPropuesta']" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} propuestas de intercambio"
    >
      <Column field="idUsuarioOfertante" header="Usuario Ofertante" />
      <Column field="idUsuarioReceptor" header="Usuario Receptor" />
      <Column field="idObjetoOfertado" header="Objeto Ofertado" />
      <Column field="idObjetoSolicitado" header="Objeto Solicitado" />
      <Column field="fechaPropuesta" header="Fecha Propuesta" />
      <!-- <Column field="estado" header="Estado" /> -->
      <Column field="id" header="Acciones" />

    </DataTable>

    <BaseModal v-model:open="isOpen" :isPDF="true">
      <iframe :src="srcPDF" class="h-full w-full" />
    </BaseModal>
  </div>
</template>
