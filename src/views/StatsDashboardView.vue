<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { SidebarInterface, SidebarItem } from '@/stores/sidebarType'
import StatsMapView from '@/sections/stats/dashboard/StatsMapView.vue'
import StatsOverview from '@/sections/stats/dashboard/StatsOverview.vue'
import StatsDemographicsView from '@/sections/stats/dashboard/StatsDemographicsView.vue'
import StatsTrendsView from '@/sections/stats/dashboard/StatsTrendsView.vue'
import StatsToolsView from '@/sections/stats/dashboard/StatsToolsView.vue'
import StatsSidebar from '@/components/navbar/StatsSidebar.vue'
import StatsNavBar from '@/components/navbar/StatsNavBar.vue'

type DashbordViews = 'overview' | 'map-view' | 'trends' | 'demographics' | 'tools'

const route = useRoute()
const router = useRouter()

const selectedView = ref<DashbordViews>((route.query.view as DashbordViews) || 'map-view')

const sidebarData: SidebarInterface = {
  class: 'flex flex-1 flex-col gap-1',
  sections: [
    {
      id: 'main',
      items: [
        { name: 'Overview', id: 'overview' },
        { name: 'Map View', id: 'map-view' },
        { name: 'Trends', id: 'trends' },
        { name: 'Demographics', id: 'demographics' },
        { name: 'Tools', id: 'tools' },
      ],
    },
  ],
}

function handleSidebarSelect(item: SidebarItem) {
  selectedView.value = item.id as DashbordViews

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
        title="Dashboard"
        subtitle="Member Visualization"
        :sidebarData="sidebarData"
        :selectedView="selectedView"
        @select="handleSidebarSelect"
      />

      <div class="flex h-full items-center justify-center">
        <StatsMapView v-if="selectedView === 'map-view'" />
        <StatsOverview v-if="selectedView === 'overview'" />
        <StatsDemographicsView v-if="selectedView === 'demographics'" />
        <StatsTrendsView v-if="selectedView === 'trends'" />
        <StatsToolsView v-if="selectedView === 'tools'" />
      </div>
    </div>
  </div>
</template>
