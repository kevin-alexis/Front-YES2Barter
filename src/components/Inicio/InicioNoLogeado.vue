<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import imgContact from '@/assets/contact.webp'
import imgBanner from '@/assets/objects.jpg'

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
</script>

<template>
  <div>
    <div
      :style="{ backgroundImage: `url(${imgBanner})` }"
      class="relative flex flex-col gap-5 p-5 md:p-20 lg:p-20 pt-30 md:pt-30 lg:pt-30 pb-50 md:pb-50 lg:pb-50 bg-cover bg-center"
    >
      <div class="absolute inset-0 bg-black/80 bg-opacity-50"></div>

      <h2 class="relative text-white font-bold text-5xl">Un espacio para intercambiar tus cosas</h2>
      <p class="relative text-white font-light md:w-3/4 text-sm sm:text-md md:text-md lg:text-lg">
        En YES2Barter, te ofrecemos una plataforma sencilla y accesible para intercambiar objetos en buen estado que ya no necesitas, ayudando a reducir el consumismo y el desperdicio. Publica lo que quieras intercambiar, recibe propuestas de otros usuarios y llega a acuerdos rápidamente. ¡Es hora de reutilizar y cuidar el medio ambiente!
      </p>
      <div class="relative w-fit">
        <RouterLink :to="{name: 'sign in'}">
          <BaseButton styleType="secondary" class="px-5" @click="scrollToTop">Comienza a intercambiar</BaseButton>
        </RouterLink>
      </div>
    </div>

    <div class="flex">
      <img :src="imgContact" class="relative inset-0 w-1/2" />
      <div class="inset-0 left-[33%] flex flex-col justify-center gap-1 lg:gap-5 w-1/3 text-center">
        <h3 class="text-[var(--primary)] font-semibold text-center text-xs sm:text-xl md:text-2xl xl:text-5xl">¡Únete a la comunidad de YES2Barter!</h3>
        <p class="hidden sm:block text-[10px] md:text-md lg:text-lg">
          Si tienes alguna idea para mejorar YES2Barter o quieres colaborar con nosotros, ¡estamos listos para escucharte!
        </p>
        <p class="text-[10px] md:text-md lg:text-lg">
          <RouterLink :to="{name: 'contacto'}" class="font-semibold text-[var(--primary)] text-[10px] md:text-md lg:text-lg" @click="scrollToTop">Contáctanos</RouterLink>
          y forma parte de nuestro movimiento para hacer del intercambio una opción accesible y responsable.
        </p>
      </div>
    </div>
  </div>
</template>
