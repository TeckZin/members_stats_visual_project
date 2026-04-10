<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { SidebarInterface, SidebarItem } from '@/stores/sidebarType'
import StatsSidebar from '@/components/navbar/StatsSidebar.vue'
import StatsNavBar from '@/components/navbar/StatsNavBar.vue'

type DocsViews = 'getting-started' | 'guides' | 'api-reference' | 'faq' | 'changelog'

const route = useRoute()
const router = useRouter()

const selectedView = ref<DocsViews>((route.query.view as DocsViews) || 'getting-started')

const sidebarData: SidebarInterface = {
  class: 'flex flex-1 flex-col gap-1',
  sections: [
    {
      id: 'main',
      items: [
        { name: 'Getting Started', id: 'getting-started' },
        { name: 'Guides', id: 'guides' },
        { name: 'API Reference', id: 'api-reference' },
        { name: 'FAQ', id: 'faq' },
        { name: 'Changelog', id: 'changelog' },
      ],
    },
  ],
}

function handleSidebarSelect(item: SidebarItem) {
  selectedView.value = item.id as DocsViews
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
        title="Docs"
        subtitle="Guides & Reference"
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
