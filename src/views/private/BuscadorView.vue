<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import ObjetoList from '@/components/Objeto/ObjetoList.vue'
import BaseInput from '@/components/BaseInput.vue'
import { onMounted } from 'vue'
import { useObjetoStore } from '@/stores/objeto'
import { computed, ref } from 'vue'
import * as yup from 'yup'
import { Form } from 'vee-validate'

const objetoStore = useObjetoStore()

const search = ref('')

const validationSchema = yup.object().shape({
  search: yup.string(),
})

const currentSchema = computed(() => {
  return validationSchema
})

const handleSubmit = async () => {
  if (search.value == '') {
    await objetoStore.getAll()
  } else {
    await objetoStore.getByName(search.value)
  }
}

onMounted(async () => {
  await objetoStore.getAll()
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
        <BaseInput
          v-model="search"
          placeholder="Buscador"
          :config="{
            label: 'Buscador',
            placeholder: 'Ingresa un objeto',
            type: 'text',
            isRequired: true,
            model: 'search',
          }"
          class="w-full sm:w-auto"
        />

        <div>
          <BaseButton styleType="primary" class="w-full sm:w-auto">
            <div class="px-2">
              <i class="pi pi-search"></i>
            </div>
          </BaseButton>
        </div>
      </Form>
    </div>

    <div
      class="flex flex-col justify-center items-center gap-5 bg-white h-105 m-10 p-8 md:p-10 rounded-2xl"
    >
      <div class="w-full max-h-[450px] overflow-y-auto">
        <ObjetoList
          v-model:objetos="objetoStore.list"
          :config="{
            showButtons: false,
          }"
        ></ObjetoList>
      </div>
    </div>
  </div>
</template>
