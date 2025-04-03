<script setup lang="ts">
import type { IBaseInput } from '@/interfaces/Base'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import { Form } from 'vee-validate'
import { useRouter } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner';

const router = useRouter()

function goBack() {
  router.back()
}

const model: any = defineModel('model')
const errors: any = defineModel('errors')

defineEmits<{
  (e: 'submit'): void
}>()

const props = defineProps<{
  config: {
    inputs: IBaseInput[]
    titleButton: string
    isCanceled?: boolean
    isLoading?: boolean
  }
}>()


</script>

<template>
  <Form class="grid gap-2" @submit.prevent="()=> $emit('submit')">
    <slot name="headerForm"></slot>
    <BaseInput
      v-for="(input, index) in props.config.inputs"
      v-bind:key="index"
      :config="input"
      v-model="model[input.model]"
      v-model:errors="errors[input.model]"
    >
    </BaseInput>
    <slot name="linkTop"></slot>
    <div class="flex gap-2">
      <BaseButton @click="$emit('submit')" type="button" style-type="primary" :isDisabled="props.config.isLoading">
        {{ props.config.titleButton }}
      </BaseButton>
      <BaseButton v-if="props.config.isCanceled" @click="goBack" type="button" style-type="danger">
        Cancelar
      </BaseButton>
    </div>
    <slot name="linkBottom"></slot>
  </Form>
</template>
