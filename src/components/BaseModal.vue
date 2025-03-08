<script setup lang="ts">
const open: any = defineModel('open')

defineProps<{
  isPDF: boolean
}>()

</script>

<template>
  <div>
    <Teleport to="body">
      <div v-if="open" class="fixed inset-0 bg-black/90 bg-opacity-50 flex justify-center items-center z-50 h-screen" @click="open = false">
        <div
        :class="
        [
          'bg-white p-6 rounded-lg shadow-lg  h-full sm:h-[90%] sm:w-[90%] transform transition-all duration-300',
          !open ? 'translate-y-6 opacity-0': '',
          isPDF ? 'w-full max-w-none' : 'w-auto!'
        ]">
          <slot></slot>
          <button
            @click="open = false"
            class="absolute top-1.5 right-1 text-gray-500 hover:text-gray-800 transition-colors bg-white rounded-full"
            aria-label="Close Modal"
          >
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
