<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import type { SidebarInterface, SidebarItem } from '@/stores/sideBarType'

const navRef = ref<HTMLElement | null>(null)
const itemRef = ref<HTMLElement[]>([])
const sidebarVisible = ref(true)

const props = defineProps<{
  title: string
  subtitle: string
  sidebarData: SidebarInterface
  selectedView: string
}>()

const emit = defineEmits<{
  (e: 'select', item: SidebarItem): void
}>()

const sidebarItemClass =
  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left transition-all'

const sidebarInactiveClass = 'text-cream/50 hover:bg-cream/5 hover:text-cream'

const sidebarActiveClass = 'bg-cream/10 text-cream'

const setItemRef = (el: Element | null) => {
  if (!el) return
  itemRef.value.push(el as HTMLElement)
}



onMounted(async () => {
  await nextTick()

  const tl = gsap.timeline()

  tl.from(navRef.value, {
    x: -128,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.out',
  })
})



</script>

<template>
  <div
    ref="navRef"
    class="absolute left-0 top-0 flex h-full w-[20rem] flex-col border-r border-cream/20 p-6"
  >

      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-lg font-semibold tracking-wide text-cream">
            {{ props.title }}
          </h2>
          <p class="mt-1 text-xs text-cream/40">
            {{ props.subtitle }}
          </p>
        </div>

      </div>


    <nav class="flex flex-1 flex-col gap-6">
      <div
        v-for="section in props.sidebarData.sections"
        :key="section.id"
        class="flex flex-col gap-1"
      >
        <button
          v-for="item in section.items"
          :key="item.id"
          type="button"
          @click="emit('select', item)"
          :ref="setItemRef"
          :class="[
            sidebarItemClass,
            props.selectedView === item.id ? sidebarActiveClass : sidebarInactiveClass,
          ]"
        >
          {{ item.name }}
        </button>

        <div class="mt-4 border-t border-cream/10"></div>
      </div>
    </nav>
  </div>
</template>
