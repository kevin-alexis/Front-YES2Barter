<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  styleType?: 'primary' | 'secondary' | 'warning' | 'danger' | 'success'
  tooltip?: string
  isDisabled?:boolean
}>()

const buttonClass = computed(() => {
  switch (props.styleType) {
    case 'primary':
      return 'bg-[var(--primary)] font-semibold text-white p-2 rounded-md'
    case 'secondary':
      return 'font-semibold text-white p-2 rounded-md border-3 border-white'
    case 'warning':
      return 'bg-[var(--warning)] font-semibold text-white p-2 rounded-md'
    case 'danger':
      return 'bg-[var(--danger)] font-semibold text-white p-2 rounded-md'
    case 'success':
      return 'bg-[var(--success)] font-semibold text-white p-2 rounded-md'
    default:
      return ''
  }
})
</script>

<template>
  <button
    :disabled="isDisabled"
    :class="[buttonClass, 'cursor-pointer w-full', isDisabled ? 'opacity-80' :'']"
    v-tooltip.top="tooltip ? { value: tooltip, showDelay: 100, hideDelay: 300 } : undefined"
  >
  <template v-if="isDisabled">
    Enviando...
  </template>
  <template v-else>
    <slot />
  </template>
  </button>
</template>
