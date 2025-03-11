<script setup lang="ts">
// import BaseTable from '@/components/BaseTable.vue'
import { useAccountStore } from '@/stores/account'
import { onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from '@primevue/core/api';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
// import Tag from 'primevue/tag';
import Button from 'primevue/button';

const loading = ref(true);
const accountStore = useAccountStore()

onMounted(async () => {
  await accountStore.getAll()
  loading.value = false
})


const filters = ref({
  nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
  esBorrado: { value: null, matchMode: FilterMatchMode.EQUALS },
})
</script>

<template>
  <div class="p-4">
<!-- <BaseTable
  :config="{
    title: 'Usuarios',
    agregar: { name: 'crear usuario', paramKey: 'idPersona'},
    columns: [
      {
        name: 'Nombre',
        nameData: 'nombre',
      },{
        name: 'Email',
        nameData: 'email',
      },{
        name: 'Rol',
        nameData: 'rol',
      }
    ],
    data: accountStore.list,
    buttons: [
    {
        title: 'Editar',
        icon: 'pi-list',
        type: 'router',
        route: { name: 'editar usuario', paramKey: 'idPersona' },
        styleType: 'warning',
      },
      {
        title: 'Eliminar',
        icon: 'pi-trash',
        type:'action',
        action: (row) => accountStore.deleteItem(row.idPersona),
        styleType: 'danger',
      },
    ],
  }"
/> -->

<div class="flex justify-end my-3">
      <RouterLink :to="{ name: 'crear usuario' }">
        <Button class="p-button-general" label="Agregar" icon="pi pi-plus" />
      </RouterLink>
    </div>
    <DataTable v-model:filters="filters" :value="accountStore.list" paginator :rows="10" dataKey="id" :rowsPerPageOptions="[5,10,15]"
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
      <template #empty>Sin usuarios encontradas</template>
      <template #loading>Cargando Usuarios</template>
      <Column field="id" header="No.">
        <template #body="{ data }">
                    {{ data.idPersona }}
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
      <Column field="email" header="Email">
        <template #body="{ data }">
                    {{ data.email }}
                </template>
      </Column>
  <Column field="actions" header="Acciones" style="width: 10rem; text-align: center;">
    <template #body="{ data }">
      <div class="flex gap-2 justify-center">
      <Button
        icon="pi pi-list"
        outlined rounded
        severity="info"
        @click="$router.push({ name: 'Administrar Usuario', params: { id: data.id } })"
      />
      <Button
        icon="pi pi-pen-to-square"
        outlined rounded
        severity="success"
        @click="$router.push({ name: 'editar usuario', params: { id: data.id } })"
      />
      <Button
        icon="pi pi-trash"
        outlined rounded
        severity="danger"
        @click="() => accountStore.deleteItem(data.id)"
      />
    </div>
    </template>
</Column>

    </DataTable>
  </div>

</template>


