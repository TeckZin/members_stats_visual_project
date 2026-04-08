<script setup lang="ts">
</script>

<template>
  <div ref="containerRef" class="fixed inset-0 -z-10 overflow-hidden bg-night">
    <div class="grain"></div>
  </div>
</template>

<style scoped>

.grain {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.15;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}
</style>
