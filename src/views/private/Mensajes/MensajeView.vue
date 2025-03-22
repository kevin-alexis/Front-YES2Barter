<script setup lang="ts">
import { useAccountStore } from '../../../stores/account'
import { onMounted, ref } from 'vue'
import { useChatStore } from '../../../stores/chat'
import ChatList from '../../../components/Chat/ChatList.vue'

const chatStore = useChatStore()
const accountStore = useAccountStore()

const sidebarVisible = ref(true)

onMounted(() => {
  chatStore.getAllByIdUsuario(accountStore.user.idUsuario)
})

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

function closeSideBar(){
  sidebarVisible.value = false;
}

</script>

<template>
  <div class="flex h-screen">
    <div :class="['flex bg-white inset-shadow-2xs h-full relative', sidebarVisible ? 'w-full md:w-1/3 animate-slide-in' : 'animate-slide-out']">
      <button
        :class="['p-2 m-1 bg-[var(--primary-dark)] text-white h-fit rounded-full right-0 cursor-pointer ', sidebarVisible ? 'absolute' : 'relative']"
        @click="toggleSidebar"
      >
        <i :class="['pi m-1', sidebarVisible ? 'pi-times' : 'pi-comment' ]"></i>
      </button>

      <div v-if="sidebarVisible" class="w-full h-full flex flex-col">
        <h1 class="p-4 text-2xl font-bold text-[var(--primary)]">Lista de chats</h1>
        <div class="flex-1 overflow-auto px-2">
          <ChatList v-model:chats="chatStore.list" class="w-full" @selectChat="closeSideBar" ></ChatList>
        </div>
      </div>
    </div>

    <div :class="[
      'bg-[var(--background)] h-full',
      sidebarVisible ? 'hidden md:w-2/3 md:block' : 'w-full'
    ]">
      <RouterView class="w-full flex flex-col"></RouterView>
    </div>
  </div>
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
    transform: translateX(-30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateX(30);
  }
  to {
    transform: translateX(0);
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

.animate-slide-out {
  animation: slide-out 0.3s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
