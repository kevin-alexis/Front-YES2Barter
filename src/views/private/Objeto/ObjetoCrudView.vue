<script setup lang="ts">
import { useObjetoStore } from '@/stores/objeto'
import { onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { FilterMatchMode } from '@primevue/core/api'
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Image from 'primevue/image'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import { useCategoriaStore } from '@/stores/categoria'
import { EstatusObjeto } from '@/common/enums/enums'
// import { formatDateToView } from '@/utils/helper'
// import BaseModal from '@/components/BaseModal.vue'
const URL_API_SOURCE = import.meta.env.VITE_APP_URL_API_SOURCE

const loading = ref(true)
const objetoStore = useObjetoStore()
const categoriaStore = useCategoriaStore()
const baseUrl = import.meta.env.VITE_APP_URL_API_SOURCE
const tipoEstadoList = Object.values(EstatusObjeto);
const srcImage = ref('')
const isOpen = ref(false)

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
  nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
  esBorrado: { value: null, matchMode: FilterMatchMode.EQUALS },
})

const getSeverity = (status: boolean) => {
  return status ? 'danger' : 'success'
}

function openModal(src: string) {
  srcImage.value = baseUrl + src.replace('\\', '/')
  isOpen.value = true
}
</script>

<template>

  <div class="p-4">
    <div class="flex justify-end my-3">
      <RouterLink :to="{ name: 'crear objeto' }">
        <Button class="p-button-general" label="Agregar" icon="pi pi-plus" />
      </RouterLink>
    </div>
    <DataTable v-model:filters="filters" :value="objetoStore.list" paginator :rows="10" dataKey="id" :rowsPerPageOptions="[5,10,15]"
      :globalFilter="filters.nombre.value" :global-filter-fields="['nombre']"  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} objetos" :loading="loading">
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


      <template #empty>Sin objetos encontrados</template>
      <template #loading>Cargando objetos</template>

      <Column field="id" header="No.">
        <template #body="{ data }"> {{ data.id }} </template>
      </Column>

      <Column field="nombre" header="Nombre">
        <template #body="{ data }"> {{ data.nombre }} </template>
      </Column>

      <Column field="descripcion" header="Descripción">
        <template #body="{ data }"> {{ data.descripcion }} </template>
      </Column>

      <Column field="fechaPublicacion" header="Fecha de Publicación">
        <template #body="{ data }"> {{ formatDateToView(data.fechaPublicacion) }} </template>
      </Column>


      <Column field="categoria" header="Categoría">
        <template #body="{ data }">
          {{ data.categoria ? data.categoria : 'Sin categoría' }}
        </template>
      </Column>

      <Column field="rutaImagen" header="Imagen">
        <template #body="{ data }">
          <!-- <img
          @click="openModal(data.rutaImagen)"
          :src="baseUrl + data.rutaImagen || 'ruta_predeterminada_a_imagen'"
          :alt="data.nombre"
          class="w-16 h-16 object-cover rounded-md cursor-pointer" /> -->
          {{ console.log(data.rutaImagen) }}
          <Image :src="URL_API_SOURCE + data.rutaImagen || 'ruta_predeterminada_a_imagen'" alt="Image" width="40"  preview />
        </template>
      </Column>

      <Column field="estado" header="Estado">
        <template #body="{ data }">
          <Tag :value="tipoEstadoList[data.estado]" :severity="getSeverity(data.estado)" />
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
              @click="$router.push({ name: 'editar objeto', params: { id: data.id } })"
            />
            <Button
              icon="pi pi-trash"
              outlined rounded
              severity="danger"
              @click="() => objetoStore.deleteItem(data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <BaseModal v-model:open="isOpen" :isPDF="false">
      <img :src="srcImage" class="h-full w-auto object-cover" />
    </BaseModal>
  </div>
</template>

