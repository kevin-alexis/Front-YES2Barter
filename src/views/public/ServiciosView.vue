<script setup lang="ts">
import ServiciosList from '@/components/Servicios/ServiciosList.vue';
</script>

<template>
  <div class="flex flex-col gap-10 p-4">
    <h1 class="text-[var(--primary)] text-6xl md:text-9xl font-bold text-center">Servicios</h1>

    <p class="text-center text-lg md:text-xl">Te ofrecemos una plataforma sencilla y segura para intercambiar objetos en buen estado y fomentar la reutilización.</p>

    <ServiciosList class="px-4 md:px-20" />
  </div>
</template>
