<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAccountStore } from '@/stores/account'
import { useRouter, RouterLink } from 'vue-router'
import BaseButton from './BaseButton.vue'

const accountStore = useAccountStore()
const router = useRouter()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const routes = computed(() => {
  return router.options.routes
    .filter((route) => {
      if (!route.meta?.menu) return false;

      if (!accountStore.user) {
        return !route.meta?.isPrivate;
      }

      const userRole = accountStore.user?.rol?.toLowerCase() ?? '';
      const roles = (route.meta?.roles ?? []).map((r) => r.toLowerCase());

      return (
        (route.meta?.isPrivate && roles.includes(userRole)) || route.meta?.isShared
      );
    })
    .map((route) => {
      return {
        ...route,
        meta: {
          ...route.meta,
          title: accountStore.user?.rol === 'Administrador' && route.meta?.title == 'Mis Objetos' ? 'Administrar Objetos' : route.meta?.title,
        },
      };
    });
});

const authRoutes = [
  { Name: 'Sign In', URL: 'sign in' },
  { Name: 'Login', URL: 'login' },
]
</script>

<template>
  <header class="flex flex-col md:flex-row justify-between items-center px-6 py-4 bg-white shadow-md relative">
    <div class="flex justify-between items-center w-full md:w-auto">
      <div class="flex items-center gap-2 w-max">
        <img alt="YES2BarterLogo" class="logo" src="@/assets/logo.png" width="50" height="50" />
        <h1 class="font-bold text-2xl md:text-xl lg:text-2xl">YES2Barter</h1>
      </div>
      <button
        @click="toggleMenu"
        class="md:hidden p-2 focus:outline-none transition-transform duration-300 transform"
        :class="{ 'rotate-90': isMenuOpen }"
      >
        <i :class="isMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-2xl"></i>
      </button>
    </div>

    <nav class="hidden md:flex md:items-center gap-1 md:gap-2 lg:gap-4 flex-wrap overflow-x-auto px-2 justify-center">
      <RouterLink
        active-class="active"
        v-for="(route, index) in routes"
        :key="index"
        :to="{ name: route.name }"
        class="text-[#8F939E] font-sans flex items-center gap-2 hover:text-[var(--primary)]
        transition duration-300 text-xs md:text-sm lg:text-base w-auto">
        <i :class="['pi', route.meta?.icon]"></i>
        {{ route.meta?.title }}
      </RouterLink>
    </nav>


    <nav :class="[isMenuOpen ? 'flex flex-col mt-4 animate-slide-in w-full' : 'hidden']" class="md:hidden">
      <RouterLink
        active-class="active-mobil"
        v-for="(route, index) in routes"
        :key="index"
        :to="{ name: route.name }"
        @click="closeMenu"
        class="text-[#8F939E] font-sans flex items-center gap-2
        p-2
        hover:text-[var(--primary)] transition duration-300 text-xs
        md:text-md lg:text-base"
      >
        <i :class="['pi', route.meta?.icon]"></i>
        {{ route.meta?.title }}
      </RouterLink>
    </nav>

    <div :class="[isMenuOpen ? 'flex flex-col mt-4 animate-fade-in' : 'hidden md:flex']">
      <div v-if="!accountStore.isLoggedIn" class="flex flex-col md:flex-row gap-2">
        <RouterLink
          active-class="active-auth"
          v-for="(route, index) in authRoutes"
          :key="index"
          :to="{ name: route.URL }"
          @click="closeMenu"
          class="cursor-pointer p-2 px-6 rounded-full font-semibold border-2 border-[var(--primary)] bg-white text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition duration-300"
        >
          {{ route.Name }}
        </RouterLink>
      </div>
      <div v-else>
        <BaseButton
          @click="() => { accountStore.logOut(); closeMenu(); }"
          type="button"
          class="
          text-xs lg:text-sm p-1 px-2 lg:p-2 lg:px-4 cursor-pointer
          rounded-full font-semibold border-2 border-[var(--primary)]
          bg-white text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition duration-300"
        >
          Log Out
        </BaseButton>
      </div>
    </div>
  </header>
</template>

<style scoped>
.active{
  color: var(--primary)
}

.active-mobil{
  color: white;
}

.active-mobil{
  background-color: var(--primary);
}

.active-auth {
  background-color: var(--primary);
  color: #ffffff;
}

@keyframes slide-in {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
