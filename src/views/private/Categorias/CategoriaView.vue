<script setup lang="ts">
// import BaseTable from '@/components/BaseTable.vue'
import { useCategoriaStore } from '@/stores/categoria'
import { onMounted, ref } from 'vue'
// import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from '@primevue/core/api';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

// const breadcrumbItems = [{ label: 'Categorias' }]

const loading = ref(true);
const categoriaStore = useCategoriaStore()

onMounted(async () => {
  await categoriaStore.getAll()
  loading.value = false
})

const filters = ref({
  nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
  esBorrado: { value: null, matchMode: FilterMatchMode.EQUALS },
})

const getSeverity = (status: boolean) => {
  switch (status) {
    case true:
      return 'danger'
    case false:
      return 'success'
    default:
      return 'info'
  }
}

const getMessages = (status: boolean) => {
  switch (status) {
    case true:
      return 'Inactivo'
    case false:
      return 'Activo'
    default:
      return 'Desconocido'
  }
}
</script>

<template>
  <div class="p-4">
    <!-- <BreadcrumbComponent :items="breadcrumbItems" />
    <BaseTable
      :config="{
        title: 'Categorías',
        agregar: { name: 'crear categoria', paramKey: 'id' },
        columns: [
          {
            name: 'Nombre',
            nameData: 'nombre',
          },
        ],
        data: categoriaStore.list,
        buttons: [
          {
            title: '',
            icon: 'pi-list',
            type: 'router',
            route: { name: 'administrar objetos', paramKey: 'id' },
            styleType: 'warning',
          },
          {
            title: '',
            icon: 'pi-pen-to-square',
            type: 'router',
            route: { name: 'editar categoria', paramKey: 'id' },
            styleType: 'warning',
          },
          {
            title: '',
            icon: 'pi-trash',
            type: 'action',
            action: (row) => categoriaStore.deleteItem(row.id),
            styleType: 'danger',
          },
        ],
      }"
    /> -->
    <div class="flex justify-end my-3">
      <Button class="p-button-general" label="Agregar" icon="pi pi-plus"/>
    </div>
    <DataTable v-model:filters="filters" :value="categoriaStore.list" paginator :rows="10" dataKey="id" :rowsPerPageOptions="[5,10,15]"
      :globalFilter="filters.nombre.value" :global-filter-fields="['nombre']">
      <template #header>
        <div class="flex justify-end">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['nombre'].value" placeholder="Buscar" />
                    </IconField>
                </div>
      </template>
      <template #empty>Sin categorías encontradas</template>
      <template #loading>Cargando categorías</template>
      <Column field="id" header="ID">
        <template #body="{ data }">
                    {{ data.id }}
                </template>
      </Column>
      <Column field="nombre" header="Nombre">
        <template #body="{ data }">
                    {{ data.nombre }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Buscar por nombre" />
                </template>
      </Column>
      <Column field="esBorrado" header="Estado">
        <template #body="{ data }">
                    <Tag :value="getMessages(data.esBorrado)" :severity="getSeverity(data.esBorrado)" />
                </template>
      </Column>
    </DataTable>
  </div>
</template>
