<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import EmptyFilesState from '@/components/EmptyFileComponent.vue'

function handleImport() {
  // TODO: implement import
}

function handleOpen() {
  // TODO: implement open
}
</script>

<template>
  <div class="flex h-full w-full gap-4">
    <EmptyFilesState
      message="No files to display"
      @import="handleImport"
      @open="handleOpen"
    />
  </div>
</template>
