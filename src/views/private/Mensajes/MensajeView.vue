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
</script>

<template>
  <div class="flex h-screen">
    <div :class="['flex bg-white h-full', sidebarVisible ? 'w-full md:w-1/3' : '']">
      <button
        class="p-2 m-5 bg-[var(--primary)] text-white h-fit rounded-full"
        @click="toggleSidebar"
      >
        <i class="pi pi-comment m-1"></i>
      </button>

      <div v-if="sidebarVisible" class="w-full h-full flex flex-col">
        <h1 class="p-4 text-2xl font-bold text-[var(--primary)]">Lista de chats</h1>
        <div class="flex-1 overflow-auto px-2">
          <ChatList v-model:chats="chatStore.list" class="w-full"></ChatList>
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
