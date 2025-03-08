<script setup lang="ts">
import BaseButton from './BaseButton.vue'

defineProps<{
  config: {
    title: string
    agregar?: { name: string; paramKey: string };
    columns: {
      name: string
      nameData: string
    }[]
    data: any[]
    buttons: {
      title: string
      icon: string
      type: 'router' | 'action'
      action?: (row: any) => void;
      route?: { name: string; paramKey: string };
      styleType: string
    }[]
  }
}>()
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-gray-800">{{ config.title }}</h1>
      <RouterLink :to="{ name: config.agregar?.name }">
        <BaseButton styleType="success">
          <i class="pi pi-plus mr-2"></i> Agregar

        </BaseButton>
      </RouterLink>
    </div>

    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="w-full h-full border-collapse border border-gray-300">
        <thead class="bg-gray-200 text-gray-700 uppercase text-sm">
          <tr>
            <th class="border border-gray-300 px-4 py-2">ID</th>
            <th v-for="(column, index) in config.columns" :key="index" class="border border-gray-300 px-4 py-2">
              {{ column.name }}
            </th>
            <th class="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="config.data.length === 0">
            <td colspan="100%" class="border border-gray-300 px-4 py-2 text-center text-red-600">
              No hay datos disponibles.
            </td>
          </tr>
          <tr v-for="(row, index) in config.data" :key="index" class="hover:bg-gray-100 border-b border-b-gray-300 h-full">
            <td class="border border-gray-300 px-4 py-2 text-center">{{ index + 1 }}</td>
            <td v-for="(column, index) in config.columns" :key="index" class="border border-gray-300 px-4 py-2">
              {{ row[column.nameData] }}
            </td>
            <td class=" px-4 py-2 text-center space-x-2 flex justify-center items-center h-full">
              <template v-for="(button, index) in config.buttons" :key="index">
                <RouterLink
                  v-if="button.type === 'router'"
                  :to="{ name: button.route.name, params: { [button.route.paramKey]: row[button.route.paramKey] } }"
                >
                  <BaseButton :styleType="button.styleType" class="w-max">
                    <i :class="['pi', button.icon]"></i>
                    {{ button.title }}
                  </BaseButton>
                </RouterLink>

                <BaseButton
                  v-else-if="button.type === 'action'"
                  :styleType="button.styleType"
                  class="w-max"
                  @click="button.action(row)"
                >
                  <i :class="['pi', button.icon]"></i>
                  {{ button.title }}
                </BaseButton>
              </template>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
