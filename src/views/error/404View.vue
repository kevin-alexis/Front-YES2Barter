<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-[var(--primary)] to-[var(--primary-gradient)] text-white text-center p-5">
    <h1 class="text-6xl font-bold mb-4">¡Oops!</h1>
    <p class="text-lg mb-6">Parece que te has perdido...</p>
    <RouterLink
      to="/"
      class="bg-white text-[var(--primary)] px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 transition-all"
    >
      Volver al inicio
    </RouterLink>
  </div>
</template>
