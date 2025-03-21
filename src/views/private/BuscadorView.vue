<script setup lang="ts">
import ObjetoList from '@/components/Objeto/ObjetoList.vue'
import BaseInput from '@/components/BaseInput.vue'
import { onMounted, watch } from 'vue'
import { useObjetoStore } from '@/stores/objeto'
import { computed, ref } from 'vue'
import * as yup from 'yup'
import { Form } from 'vee-validate'
import MultiSelect from 'primevue/multiselect'
import { useCategoriaStore } from '@/stores/categoria'
import { EstatusObjeto } from '@/common/enums/enums'

const objetoStore = useObjetoStore()
const categoriaStore = useCategoriaStore()
const filteredObjetos = ref([])
const selectedCategorias = ref([])
const search = ref('')
const validationSchema = yup.object().shape({
  search: yup.string(),
})

const currentSchema = computed(() => {
  return validationSchema
})

const handleSubmit = async () => {
  if (search.value == '') {
    await objetoStore.getAllByIdEstatus(EstatusObjeto.DISPONIBLE)
  } else {
    await objetoStore.getByName(search.value)
  }
}

onMounted(async () => {
  await objetoStore.getAllByIdEstatus(EstatusObjeto.DISPONIBLE)
  await categoriaStore.getAll()
  filterObjetos()
})

const filterObjetos = () => {
  if (!objetoStore.list.length) return

  filteredObjetos.value = objetoStore.list.filter((objeto) => {
    const matchesName = search.value
      ? objeto.nombre.toLowerCase().includes(search.value.toLowerCase())
      : true

    const matchesCategory =
      selectedCategorias.value.length > 0
        ? selectedCategorias.value.some((cat) => {
            return cat.id === objeto.idCategoria
          })
        : true

    return matchesName && matchesCategory
  })
}

watch([search, selectedCategorias], () => {
  filterObjetos()
})
</script>

<template>
  <div class="p-5">
    <h1
      class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--primary)] text-center"
    >
      Buscador
    </h1>

    <div class="w-full mt-5">
      <Form
        :validation-schema="currentSchema"
        @submit="handleSubmit"
        class="flex flex-row sm:flex-row justify-center items-end gap-3 sm:gap-2"
      >
      <div class="flex flex-col md:flex-row gap-3 md:gap-2 items-center justify-center">
        <div class="card flex flex-col justify-center">
          <h1>Por categoría</h1>
          <MultiSelect
          append-to="body"
            v-model="selectedCategorias"
            display="chip"
            :options="categoriaStore.list"
            optionLabel="nombre"
            filter
            placeholder="Filtra por categoría"
            :maxSelectedLabels="3"
            selected-items-label="{0} elementos seleccionados"
            class="w-80 md:w-80"
          />
        </div>
        <BaseInput
          v-model="search"
          placeholder="Buscador"
          :config="{
            label: 'Buscador',
            placeholder: 'Ingresa un objeto',
            type: 'text',
            isRequired: false,
            model: 'search',
          }"
          class="w-full sm:w-auto"
        />
      </div>
        <!-- <div>
          <BaseButton type="submit" styleType="primary" class="w-full sm:w-auto">
            <div class="px-2">
              <i class="pi pi-search"></i>
            </div>
          </BaseButton>
        </div> -->
      </Form>
    </div>


    <div
  class="flex flex-col justify-center items-center gap-5 bg-white m-8 p-8 md:p-10 rounded-2xl shadow-lg w"
>
  <ObjetoList
    v-model:objetos="filteredObjetos"
    :config="{
      showButtons: false,
    }"
  ></ObjetoList>
</div>

  </div>
</template>
