<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  styleType?: 'primary' | 'secondary' | 'warning' | 'danger'  | 'success'
}>()

const buttonClass = computed(() => {
  switch (props.styleType) {
    case 'primary':
      return 'bg-[var(--primary)] font-semibold text-white p-2 rounded-md'
    case 'secondary':
      return 'font-semibold text-white p-2 rounded-md border-3 border-white'
    case 'warning':
      return 'bg-[var(--primary)] font-semibold text-white p-2 rounded-md'
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

  <button :class="[buttonClass, 'cursor-pointer w-full']">
    <slot />
  </button>
</template>
