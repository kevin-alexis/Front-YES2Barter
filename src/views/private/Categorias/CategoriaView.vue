<script setup lang="ts">
import { useCategoriaStore } from '@/stores/categoria'
import { onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from '@primevue/core/api';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';


const loading = ref(true);
const categoriaStore = useCategoriaStore()

onMounted(() => {
  categoriaStore.getAll().then(() => {
    loading.value = false;
  });
});


const filters = ref({
  nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
  esBorrado: { value: null, matchMode: FilterMatchMode.EQUALS },
})

</script>

<template>
  <div class="p-4">
    <div class="flex justify-end my-3">
      <RouterLink :to="{ name: 'crear categoria' }">
        <Button class="p-button-general" label="Agregar" icon="pi pi-plus" />
      </RouterLink>
    </div>
    <DataTable v-model:filters="filters" :value="categoriaStore.list" paginator :rows="10" dataKey="id" :rowsPerPageOptions="[5,10,15]"
      :globalFilter="filters.nombre.value" :global-filter-fields="['nombre']"  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} categorías" :loading="loading">
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
      <template #loading><i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i></template>
      <Column field="id" header="No.">
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
  <Column field="actions" header="Acciones" style="width: 10rem; text-align: center;">
    <template #body="{ data }">
      <div class="flex gap-2 justify-center">
      <Button
        icon="pi pi-pen-to-square"
        outlined rounded
        severity="success"
        v-tooltip.top="{ value: 'Editar', showDelay: 100, hideDelay: 300, }"
        @click="$router.push({ name: 'editar categoria', params: { id: data.id } })"
      />
      <Button
        icon="pi pi-trash"
        outlined rounded
        severity="danger"
        v-tooltip.top="{ value: 'Eliminar', showDelay: 100, hideDelay: 300, }"
        @click="() => categoriaStore.deleteItem(data.id)"
      />
    </div>
    </template>
</Column>

    </DataTable>
  </div>
</template>
