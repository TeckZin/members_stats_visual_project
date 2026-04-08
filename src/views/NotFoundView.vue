<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen text-center">
    <h1 class="text-6xl font-bold text-warm-white">404</h1>
    <p class="text-cream mt-4 text-xl">Page not found</p>
    <RouterLink to="/" class="mt-6 px-6 py-2 bg-coral text-night rounded hover:bg-tangerine">
      Go Home
    </RouterLink>
  </div>
</template>
