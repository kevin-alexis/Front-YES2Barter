<script setup lang="ts">
import { usePropuestaIntercambioStore } from '@/stores/propuestaIntercambio'
import { useObjetoStore } from '@/stores/objeto'
import { onMounted, ref } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from '@primevue/core/api';
import Button from 'primevue/button';
import { formatDateToView } from '@/utils/helper'
import { EstatusPropuestaIntercambio } from '@/common/enums/enums'
import Tag from 'primevue/tag';

const tipoEstatusPropuestaIntercambioList = Object.values(EstatusPropuestaIntercambio);
const objetoStore = useObjetoStore()
const propuestaIntercambioStore = usePropuestaIntercambioStore()
const isOpen = ref(false)
const baseUrl = import.meta.env.VITE_APP_URL_API_SOURCE
const srcPDF = ref('')
const loading = ref(true);

onMounted(async () => {

  await propuestaIntercambioStore.getAllPropuestas()
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

function getIndexEnum(enumData: any){
  return Object.values(EstatusPropuestaIntercambio).indexOf(enumData)
}

const getSeverity = (status: number): string => {
  switch (status) {
    case getIndexEnum(EstatusPropuestaIntercambio.ENVIADA):
      return 'warn';

    case getIndexEnum(EstatusPropuestaIntercambio.ACEPTADA):
      return 'success';

    case getIndexEnum(EstatusPropuestaIntercambio.RECHAZADA):
      return 'danger';

    case getIndexEnum(EstatusPropuestaIntercambio.CONCRETADA):
      return 'success';

    case getIndexEnum(EstatusPropuestaIntercambio.NO_CONCRETADA):
      return 'info';

    default:
      return 'info';
  }
}

</script>

<template>
  <div class="p-4">
    <div class="flex justify-end my-3">
      <RouterLink :to="{ name: 'crear propuesta intercambio' }">
        <Button class="p-button-general" label="Agregar" icon="pi pi-plus" />
      </RouterLink>
    </div>
    <DataTable v-model:filters="filters" :value="propuestaIntercambioStore.list" :loading="loading" paginator :rows="10" dataKey="id" :rowsPerPageOptions="[5, 10, 15]"
    :globalFilterFields="['idUsuarioOfertante', 'idUsuarioReceptor', 'idObjetoOfertado', 'idObjetoSolicitado', 'fechaPropuesta']" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} propuestas de intercambio"
    >
      <Column field="personaOfertante.nombre" header="Usuario Ofertante" />
      <Column field="personaReceptor.nombre" header="Usuario Receptor" />
      <Column field="objetoOfertado.nombre" header="Objeto Ofertado" />
      <Column field="objetoSolicitado.nombre" header="Objeto Solicitado" />
      <Column field="fechaPropuesta" header="Fecha Propuesta">
        <template #body="{ data }"> {{ formatDateToView(data.fechaPropuesta)  }} </template>
      </Column>
      <Column field="estado" header="Estado">
        <template #body="{ data }">
          <Tag :value="tipoEstatusPropuestaIntercambioList[data.estado]" :severity="getSeverity(data.estado)" />
        </template>
      </Column>

      <Column field="actions" header="Acciones" style="width: 10rem; text-align: center;">
        <template #body="{ data }">
          <div class="flex gap-2 justify-center">
            <Button
              icon="pi pi-pen-to-square"
              outlined
              rounded
              severity="success"
              v-if="data.id"
              @click="$router.push({ name: 'editar propuesta intercambio', params: { id: data.id } })"
            />
            <Button
              icon="pi pi-trash"
              outlined rounded
              severity="danger"
              @click="() => propuestaIntercambioStore.deleteItem(data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <BaseModal v-model:open="isOpen" :isPDF="true">
      <iframe :src="srcPDF" class="h-full w-full" />
    </BaseModal>
  </div>
</template>
