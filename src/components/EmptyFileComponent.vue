<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'No files to display',
})
</script>

<template>
  <div
    class="flex h-full w-full flex-col items-center justify-center gap-6 bg-night text-cream"
  >
    <p class="text-lg font-medium opacity-80">{{ message }}</p>
    <div class="flex gap-3">
      <RouterLink to="/stats/data-manager?view=import-export">
        <BaseButton size="md">IMPORT</BaseButton>
      </RouterLink>
      <RouterLink to="/stats/data-manager?view=all-records">
        <BaseButton variant="second" size="md">OPEN</BaseButton>
      </RouterLink>
    </div>
  </div>
</template>
