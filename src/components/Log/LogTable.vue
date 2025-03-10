<script setup lang="ts">
import { ref } from 'vue'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputIcon from 'primevue/inputicon'
import IconField from 'primevue/iconfield'
import DatePicker from 'primevue/datepicker'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

const filters = ref()
const niveles = ref(['Error', 'Warning', 'Info'])
const logs: any = defineModel('logs')
const expandedRows = ref([])

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    mensaje: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    excepcion: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    fecha: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    nivel: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  }
}

initFilters()

const formatDate = (value: string | Date) => {
  const date = new Date(value)
  if (isNaN(date.getTime())) {
    return ''
  }
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const clearFilter = () => {
  initFilters()
}

const getSeverity = (status) => {
  switch (status) {
    case 'Error':
      return 'danger'
    case 'Warning':
      return 'warn'
    case 'Info':
      return 'info'
    default:
      return 'info'
  }
}
</script>

<template>
  <div class="card">
    <DataTable
      v-model:filters="filters"
      :value="logs"
      paginator
      :rows="5"
      dataKey="id"
      filterDisplay="menu"
      v-model:expandedRows="expandedRows"
      :globalFilterFields="['mensaje', 'excepcion', 'fecha', 'nivel']"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
    >
      <template #header>
        <div class="flex justify-between">
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            @click="clearFilter()"
          />
          <IconField class="hidden md:block">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </IconField>
        </div>
      </template>

      <template #empty> Excepciones no encontradas. </template>

      <Column expander style="width: 3rem" />

      <Column field="mensaje" header="Mensaje" sortable style="min-width: 14rem">
        <template #body="{ data }">
          {{ data.mensaje }}
        </template>
      </Column>

      <Column
        field="fecha"
        header="Fecha"
        sortable
        filterField="fecha"
        dataType="fecha"
        style="min-width: 10rem"
      >
        <template #body="{ data }">
          {{ formatDate(data.fecha) }}
        </template>
        <template #filter="{ filterModel }">
          <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
        </template>
      </Column>

      <Column field="nivel" header="Nivel" sortable filterMatchMode="equals" style="width: 25%">
        <template #body="{ data }">
          <Tag :value="data.nivel" :severity="getSeverity(data.nivel)" />
        </template>
        <template #filter="{ filterModel }">
          <Select v-model="filterModel.value" :options="niveles" placeholder="Select One" showClear>
            <template #option="slotProps">
              <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
            </template>
          </Select>
        </template>
      </Column>

      <template #expansion="{ data }">
        <div class="p-4 border-t">
          <strong>Excepción:</strong>
          <p>{{ data.excepcion }}</p>
        </div>
      </template>
    </DataTable>
  </div>
</template>
