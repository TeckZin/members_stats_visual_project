<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { SidebarInterface, SidebarItem } from '@/stores/sidebarType'
import StatsSidebar from '@/components/navbar/StatsSidebar.vue'
import StatsNavBar from '@/components/navbar/StatsNavBar.vue'

type DataManagerViews =
  | 'all-records'
  | 'segments'
  | 'derived-tables'
  | 'query-builder'
  | 'files'
  | 'import-export'
  | 'trash'

const route = useRoute()
const router = useRouter()

const selectedView = ref<DataManagerViews>(
  (route.query.view as DataManagerViews) || 'all-records',
)

const sidebarData: SidebarInterface = {
  class: 'flex flex-1 flex-col gap-1',
  sections: [
    {
      id: 'main',
      items: [
        { name: 'All Records', id: 'all-records' },
        { name: 'Segments', id: 'segments' },
        { name: 'Derived Tables', id: 'derived-tables' },
        { name: 'Query Builder', id: 'query-builder' },
        { name: 'Files', id: 'files' },
        { name: 'Imports/Exports', id: 'import-export' },
        { name: 'Trash', id: 'trash' },
      ],
    },
  ],
}

function handleSidebarSelect(item: SidebarItem) {
  selectedView.value = item.id as DataManagerViews
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
        title="Data Manager"
        subtitle="Organize & Maintain Data"
        :sidebarData="sidebarData"
        :selectedView="selectedView"
        @select="handleSidebarSelect"
      />
      <div class="flex h-full items-center justify-center">
        <!-- Add view components here -->
      </div>
    </div>
  </div>
</template>
