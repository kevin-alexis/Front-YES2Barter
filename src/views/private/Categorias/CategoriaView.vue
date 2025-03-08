<script setup lang="ts">
import BaseTable from '@/components/BaseTable.vue'
import { useCategoriaStore } from '@/stores/categoria'
import { onMounted } from 'vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'

const breadcrumbItems = [{ label: 'Categorias' }]

const categoriaStore = useCategoriaStore()

onMounted(async () => {
  await categoriaStore.getAll()
})
</script>

<template>
  <div>
    <BreadcrumbComponent :items="breadcrumbItems" />
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
    />
  </div>
</template>
