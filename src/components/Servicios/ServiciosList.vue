<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue'
import service1 from '@/assets/service-1.png'
import service2 from '@/assets/service-2.png'
import service3 from '@/assets/service-3.png'

const services = [
  {
    title: 'Intercambio sin dinero',
    img: service1,
    description: 'Intercambia objetos en buen estado sin necesidad de dinero, promoviendo el consumo responsable.'
  },
  {
    title: 'Fácil y rápido',
    img: service2,
    description: 'Publica tus artículos y recibe propuestas de intercambio de manera sencilla y ágil.'
  },
  {
    title: 'Sostenibilidad',
    img: service3,
    description: 'Contribuye al medio ambiente al reutilizar y evitar el desperdicio de productos útiles.'
  },
]
</script>

<template>
  <div class="flex flex-wrap gap-10 justify-center px-4">
    <BaseCard
      v-for="(service, index) in services"
      v-bind:key="index"
      class="w-full sm:w-72 md:w-60 flex flex-col justify-between items-center p-4"
    >
      <h3 class="font-semibold text-2xl text-center">{{ service.title }}</h3>
      <img :src="service.img" class="w-[60%] h-auto" />
      <p class="w-full text-gray-600 font-light text-center">{{ service.description }}</p>
    </BaseCard>
  </div>
</template>
