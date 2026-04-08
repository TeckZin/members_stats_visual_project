<script setup lang="ts">
  // Home
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen text-center">
    <h1 class="font-heading text-4xl md:text-6xl text-warm-white tracking-wide">MEMBER MANAGEMENT</h1>
    <p class="font-mont text-cream mt-4 text-base md:text-lg">Stats. Notifications. Fast.</p>
    <div class="flex gap-4 mt-8 tracking-widest">
      <RouterLink to="/stats" class="font-space font-semibold px-6 py-3 bg-coral text-night rounded hover:bg-warm-white hover:text-night">
        STATS
      </RouterLink>
      <RouterLink to="/ans" class="font-space font-semibold px-6 py-3 border border-cream text-cream rounded hover:bg-warm-white hover:text-night hover:border-transparent">
        ANS
      </RouterLink>
    </div>
  </div>
</template>
