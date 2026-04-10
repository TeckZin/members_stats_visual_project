<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { SidebarInterface, SidebarItem } from '@/stores/sidebarType'
import StatsSidebar from '@/components/navbar/StatsSidebar.vue'
import StatsNavBar from '@/components/navbar/StatsNavBar.vue'

type AdminViews = 'users' | 'roles-permissions' | 'audit-log' | 'settings'

const route = useRoute()
const router = useRouter()

const selectedView = ref<AdminViews>((route.query.view as AdminViews) || 'users')

const sidebarData: SidebarInterface = {
  class: 'flex flex-1 flex-col gap-1',
  sections: [
    {
      id: 'main',
      items: [
        { name: 'Users', id: 'users' },
        { name: 'Roles & Permissions', id: 'roles-permissions' },
        { name: 'Audit Log', id: 'audit-log' },
        { name: 'Settings', id: 'settings' },
      ],
    },
  ],
}

function handleSidebarSelect(item: SidebarItem) {
  selectedView.value = item.id as AdminViews
  router.replace({
    query: {
      view: item.id,
    },
  })
}
</script>

<template>
  <div class="grid min-h-screen grid-rows-[80px_1fr] bg-night text-cream">
    <StatsNavBar />
    <div class="relative h-full">
      <StatsSidebar
        title="Admin"
        subtitle="Manage Access & Settings"
        :sidebarData="sidebarData"
        :selectedView="selectedView"
        @select="handleSidebarSelect"
      />
      <div class="flex h-full items-center justify-center">
      </div>
    </div>
  </div>
</template>
