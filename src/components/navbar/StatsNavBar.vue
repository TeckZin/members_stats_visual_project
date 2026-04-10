<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { RouterLink } from 'vue-router'
import { auth } from '@/firebase'
import { onAuthStateChanged, type User } from 'firebase/auth'

const navRef = ref<HTMLElement | null>(null)
const logoRef = ref<HTMLElement | null>(null)
const linksRef = ref<HTMLElement | null>(null)
const accountRef = ref<HTMLElement | null>(null)

const currentUser = ref<User | null>(auth.currentUser)

onAuthStateChanged(auth, (user) => {
  currentUser.value = user
})

onMounted(async () => {
  await nextTick()
  const linkItems = linksRef.value ? Array.from(linksRef.value.children) : []
  const tl = gsap.timeline()
  tl.from(navRef.value, {
    y: -32,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  })
    .from(
      logoRef.value,
      {
        y: -18,
        opacity: 0,
        duration: 0.45,
        ease: 'power3.out',
      },
      '-=0.4',
    )
    .from(
      linkItems,
      {
        y: -16,
        opacity: 0,
        duration: 0.4,
        stagger: 0.12,
        ease: 'power3.out',
      },
      '-=0.25',
    )
    .from(
      accountRef.value,
      {
        y: -18,
        opacity: 0,
        duration: 0.45,
        ease: 'power3.out',
      },
      '-=0.35',
    )
})
</script>

<template>
  <nav ref="navRef" class="flex items-center justify-between px-6">
    <div ref="logoRef">
      <RouterLink to="/" class="font-heading text-3xl tracking-[0.08em]">STATS</RouterLink>
    </div>
    <div ref="linksRef" class="flex gap-8 font-poppins text-base">
      <RouterLink to="/stats" class="nav-link">Dashboard</RouterLink>
      <RouterLink to="/stats/data-manager" class="nav-link">Data Manager</RouterLink>
      <RouterLink to="/admin" class="nav-link">Admin</RouterLink>
      <RouterLink to="/docs" class="nav-link">Docs</RouterLink>
    </div>

    <div ref="accountRef" class="font-poppins text-base">
      <RouterLink v-if="currentUser" to="/account" class="nav-link">
        Account
      </RouterLink>
      <div v-else class="flex gap-4">
        <RouterLink to="/auth?mode=login" class="nav-link">Log In</RouterLink>
        <RouterLink to="/auth?mode=signup" class="nav-link">Sign Up</RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  position: relative;
  display: inline-block;
  padding-bottom: 0.2rem;
}
.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.nav-link:hover::after {
  transform: scaleX(1);
}
</style>
