<script setup lang="ts">
import BaseTable from '@/components/BaseTable.vue'
import { useAccountStore } from '@/stores/account'
import { onMounted } from 'vue'

const accountStore = useAccountStore()

onMounted(async () => {
  await accountStore.getAll()
})
</script>

<template>
<BaseTable
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
/>
</template>
