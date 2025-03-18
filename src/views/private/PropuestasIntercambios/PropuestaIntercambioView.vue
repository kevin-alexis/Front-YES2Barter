<script setup lang="ts">
import { usePropuestaIntercambioStore } from '@/stores/propuestaIntercambio'
import { onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { FilterMatchMode } from '@primevue/core/api'
import Button from 'primevue/button'
import { formatDateToView } from '@/utils/helper'
import { EstatusPropuestaIntercambio } from '@/common/enums/enums'
import Tag from 'primevue/tag'
import IconField from 'primevue/iconfield'
import InputText from 'primevue/inputtext'
import InputIcon from 'primevue/inputicon'

const tipoEstatusPropuestaIntercambioList = Object.values(EstatusPropuestaIntercambio)
const propuestaIntercambioStore = usePropuestaIntercambioStore()
const loading = ref(true)

onMounted(async () => {
  await propuestaIntercambioStore.getAllPropuestas()
  loading.value = false
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  idUsuarioOfertante: { value: null, matchMode: FilterMatchMode.CONTAINS },
  idUsuarioReceptor: { value: null, matchMode: FilterMatchMode.CONTAINS },
  idObjetoOfertado: { value: null, matchMode: FilterMatchMode.EQUALS },
  idObjetoSolicitado: { value: null, matchMode: FilterMatchMode.EQUALS },
  fechaPropuesta: { value: null, matchMode: FilterMatchMode.EQUALS },
})

function getIndexEnum(enumData: any) {
  return Object.values(EstatusPropuestaIntercambio).indexOf(enumData)
}

const getSeverity = (status: number): string => {
  switch (status) {
    case getIndexEnum(EstatusPropuestaIntercambio.ENVIADA):
      return 'warn'

    case getIndexEnum(EstatusPropuestaIntercambio.ACEPTADA):
      return 'success'

    case getIndexEnum(EstatusPropuestaIntercambio.RECHAZADA):
      return 'danger'

    case getIndexEnum(EstatusPropuestaIntercambio.CONCRETADA):
      return 'success'

    case getIndexEnum(EstatusPropuestaIntercambio.NO_CONCRETADA):
      return 'info'

    default:
      return 'info'
  }
}

const first = ref(0);

const onPage = (event) => {
  first.value = event.first;
};

</script>

<template>
  <div class="p-4">
    <div class="flex justify-end my-3">
      <RouterLink :to="{ name: 'crear propuesta intercambio' }">
        <Button class="p-button-general" label="Agregar" icon="pi pi-plus" />
      </RouterLink>
    </div>
    <DataTable
      v-model:filters="filters"
      :value="propuestaIntercambioStore.list"
      paginator
      :rows="10"
      dataKey="id"
      :rowsPerPageOptions="[5, 10, 15]"
      :globalFilterFields="[
        'personaOfertante.nombre',
        'personaReceptor.nombre',
        'objetoOfertado.nombre',
        'objetoSolicitado.nombre',
        'fechaPropuesta',
        'estado',
      ]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} propuestas de intercambio"
      :loading="loading"
      :first="first"
      @page="onPage($event)"
    >
      <template #header>
        <div class="flex justify-end">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Buscar" />
          </IconField>
        </div>
      </template>

      <template #empty>Sin propuestas encontradas</template>
      <template #loading>Cargando propuestas</template>

      <Column field="id" header="No." sortable>
        <template #body="{ index }">
          {{ index + 1 + first }}
        </template>
      </Column>

      <Column field="personaOfertante.nombre" header="Usuario Ofertante" sortable />
      <Column field="personaReceptor.nombre" header="Usuario Receptor" sortable />
      <Column field="objetoOfertado.nombre" header="Objeto Ofertado" sortable />
      <Column field="objetoSolicitado.nombre" header="Objeto Solicitado" sortable />
      <Column field="fechaPropuesta" header="Fecha Propuesta" sortable>
        <template #body="{ data }"> {{ formatDateToView(data.fechaPropuesta) }} </template>
      </Column>
      <Column field="estado" header="Estado" sortable>
        <template #body="{ data }">
          <Tag
            :value="tipoEstatusPropuestaIntercambioList[data.estado]"
            :severity="getSeverity(data.estado)"
          />
        </template>
      </Column>

      <Column field="actions" header="Acciones" style="width: 10rem; text-align: center">
        <template #body="{ data }">
          <div class="flex gap-2 justify-center">
            <Button
              icon="pi pi-pen-to-square"
              outlined
              rounded
              severity="success"
              v-if="data.id"
              @click="
                $router.push({ name: 'editar propuesta intercambio', params: { id: data.id } })
              "
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="() => propuestaIntercambioStore.deleteItem(data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
