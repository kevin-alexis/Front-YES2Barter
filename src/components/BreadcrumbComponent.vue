<template>
  <nav class="breadcrumb">
    <ul>
      <li v-for="(item, index) in breadcrumbItems" :key="index" class="breadcrumb-item">
        <router-link
          v-if="item.route && item.route !== 'back'"
          :to="item.route"
          :class="['breadcrumb-link', linkClass]"
        >
          {{ item.label }}
          <span v-if="index < breadcrumbItems.length - 1" class="breadcrumb-separator">{{ separator }}</span>
        </router-link>
        <button
          v-else-if="item.route === 'back'"
          @click="goBack"
          :class="['breadcrumb-back']"
        >
          {{ item.label }}
          <span v-if="index < breadcrumbItems.length - 1" class="breadcrumb-separator">{{ separator }}</span>
        </button>
        <span v-else class="breadcrumb-text">
          {{ item.label }}
          <span v-if="index < breadcrumbItems.length - 1" class="breadcrumb-separator">{{ separator }}</span>
        </span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  items: { label: string; route?: string }[];
  styleType?: 'primary' | 'secondary' | 'warning' | 'danger' | 'success';
}>()

const router = useRouter()

function goBack() {
  router.back()
}

function replaceRouteParams(route: string): string {
  if (route) {
    return route.replace(/:([a-zA-Z0-9_]+)/g, (match, param) => {
      return route.params[param] || match
    })
  }
  return route
}

const breadcrumbItems = computed(() => {
  return props.items.map((item) => {
    if (item.route) {
      return { ...item, route: replaceRouteParams(item.route) }
    }
    return item
  })
})

const separator = computed(() => '›')

const linkClass = computed(() => {
  switch (props.styleType) {
    case 'primary':
      return 'text-[var(--primary)] font-semibold hover:text-[var(--primary-dark)]'
    case 'secondary':
      return 'text-white border-2 border-white font-semibold hover:text-white hover:border-[var(--primary)]'
    case 'warning':
      return 'text-[var(--warning)] font-semibold hover:text-[var(--warning-dark)]'
    case 'danger':
      return 'text-[var(--danger)] font-semibold hover:text-[var(--danger-dark)]'
    case 'success':
      return 'text-[var(--success)] font-semibold hover:text-[var(--success-dark)]'
    default:
      return 'text-[#6C6DE7] text-xl pt-2'
  }
})

</script>

<style scoped>
.breadcrumb ul {
  display: flex;
  gap: 8px;
  list-style: none;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 8px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  padding-top: 10px;
  font-size: 20px;
}

.breadcrumb-back {
  background: none;
  border: none;
  font-weight: 500;
  color: #6C6DE7;
  cursor: pointer;
  transition: color 0.3s ease;
  padding-top: 10px;
  font-size: 20px;
}

.breadcrumb-text {
  color: #6c757d;
  padding-top: 10px;
  font-size: 20px;
}

.breadcrumb-separator {
  margin: 0 4px;
  color: #6c757d;
}
</style>
