<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate'
import type { IBaseInput } from '@/interfaces/Base'
import { ref } from 'vue'

const errors: any = defineModel('errors')
const isVisible = ref(false)

const placeholders = {
  email: 'user@example.com',
  text: '',
  number: '998-XXXX-XXX',
  password: '**********',
  textarea: 'Escribe un mensaje',
  select: 'Selecciona una opción',
}

function switchVisibility() {
  isVisible.value = !isVisible.value
}

defineProps<{
  config: IBaseInput
}>()

const model = defineModel()
</script>

<template>
  <div
  v-if="!config.isHidden"
  :class="[
    'flex ',
    config.type === 'checkbox' ? '': 'flex-col'
  ]">
    <label :class="['']">{{ config.label }}<span v-if="config.isRequired" class="text-red-600">*</span></label
    >
    <textarea
      v-if="config.type == 'textarea'"
      :class="[
        'bg-white p-1 rounded-md border border-gray-300 disabled:border-gray-400 disabled:bg-gray-300/50 disabled:text-black/50',
      ]"
      :placeholder="config.placeholder ?? placeholders[config.type]"
      :type="config.type"
      :required="config.isRequired"
      v-model="model"
      :disabled="config.isDisabled"
    />
    <select
      v-else-if="config.type == 'select' && config.select && config.select.data.length"
      v-model="model"
      class="bg-white p-2 rounded-md border border-gray-300 text-sm sm:text-base w-full sm:w-64 disabled:border-gray-400 disabled:bg-gray-300/50 disabled:text-black/50"
      :disabled="config.isDisabled"
      :hidden="config.isHidden"
    >
      <option
        v-for="option in config.select.data"
        :key="option[config.select.valueKey]"
        :value="option[config.select.valueKey]"
      >
        {{ option[config.select.paramKey] }}
      </option>
    </select>

    <div v-else-if="config.type === 'checkbox'" :class="['flex items-center gap-2']">
      <input
        type="checkbox"
        :checked="model"
        @change="model = $event.target.checked"
        :disabled="config.isDisabled"
        class="h-4 w-4"
      />
    </div>

    <div v-else class="flex w-full relative">
      <Field
        class="w-full bg-white p-2 rounded-md border border-gray-300 disabled:border-gray-400 disabled:bg-gray-300/50 disabled:text-black/50 h-[2.85rem]"
        :placeholder="config.placeholder ?? placeholders[config.type]"
        :type="isVisible ? 'text' : config.type"
        :required="config.isRequired"
        v-model="model"
        :name="config.model"
        :disabled="config.isDisabled"
      />
      <button
        @click="switchVisibility"
        type="button"
        class="absolute right-2 top-3 cursor-pointer"
        v-if="config.type === 'password'"
      >
        <i :class="['pi text-4xl', isVisible ? 'pi-eye' : 'pi-eye-slash']"></i>
      </button>
    </div>

    <span v-if="errors" class="text-red-500">{{ errors }}</span>
  </div>
</template>
