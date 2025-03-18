<script setup lang="ts">
import { useObjetoStore } from '@/stores/objeto'
import { onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { FilterMatchMode } from '@primevue/core/api'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Image from 'primevue/image'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import { useCategoriaStore } from '@/stores/categoria'
import { EstatusObjeto } from '@/common/enums/enums'
import { formatDateToView } from '@/utils/helper'

const URL_API_SOURCE = import.meta.env.VITE_APP_URL_API_SOURCE

const loading = ref(true)
const objetoStore = useObjetoStore()
const categoriaStore = useCategoriaStore()
const tipoEstadoList = Object.values(EstatusObjeto)

onMounted(async () => {
  await categoriaStore.getAll()
  await objetoStore.getAll()
  objetoStore.list.forEach((obj) => {
    const categoria = categoriaStore.list.find((cat) => cat.id === obj.idCategoria)
    obj.categoria = categoria ? categoria.nombre : 'Sin categoría'
  })
  loading.value = false
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
  descripcion: { value: null, matchMode: FilterMatchMode.CONTAINS },
  estado: { value: null, matchMode: FilterMatchMode.EQUALS },
})

const getSeverity = (status: boolean) => {
  return status ? 'danger' : 'success'
}

const first = ref(0);

const onPage = (event) => {
  first.value = event.first;
};

</script>

<template>
  <div class="p-4">
    <div class="flex justify-end my-3">
      <RouterLink :to="{ name: 'crear objeto' }">
        <Button class="p-button-general" label="Agregar" icon="pi pi-plus" />
      </RouterLink>
    </div>
    <DataTable
      v-model:filters="filters"
      :value="objetoStore.list"
      paginator
      :rows="10"
      dataKey="id"
      :rowsPerPageOptions="[5, 10, 15]"
      :global-filter-fields="['nombre', 'descripcion', 'fechaPublicación', 'categoria']"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} objetos"
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

      <template #empty>Sin objetos encontrados</template>
      <template #loading>Cargando objetos</template>

      <Column field="id" header="No." sortable>
        <template #body="{ index }">
          {{ index + 1 + first }}
        </template>
      </Column>

      <Column field="nombre" header="Nombre" sortable>
        <template #body="{ data }"> {{ data.nombre }} </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            placeholder="Buscar por nombre"
          />
        </template>
      </Column>

      <Column field="descripcion" header="Descripción" sortable>
        <template #body="{ data }"> {{ data.descripcion }} </template>
      </Column>

      <Column field="fechaPublicacion" header="Fecha de Publicación" sortable>
        <template #body="{ data }"> {{ formatDateToView(data.fechaPublicacion) }} </template>
      </Column>

      <Column field="categoria" header="Categoría" sortable>
        <template #body="{ data }">
          {{ data.categoria ? data.categoria : 'Sin categoría' }}
        </template>
      </Column>

      <Column field="rutaImagen" header="Imagen">
        <template #body="{ data }">
          <Image
            :src="URL_API_SOURCE + data.rutaImagen || 'ruta_predeterminada_a_imagen'"
            alt="Image"
            width="80"
            preview
          />
        </template>
      </Column>

      <Column field="estado" header="Estado" sortable>
        <template #body="{ data }">
          <Tag :value="tipoEstadoList[data.estado]" :severity="getSeverity(data.estado)" />
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
              @click="$router.push({ name: 'editar objeto', params: { id: data.id } })"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="() => objetoStore.deleteItem(data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
