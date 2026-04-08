<script setup lang="ts">
import { RouterView } from 'vue-router'
import LavaBackground from './components/background/LavaBackground.vue'
</script>

<template>
  <LavaBackground />
  <div class="min-h-screen text-cream relative">
    <RouterView />
  </div>
</template>
