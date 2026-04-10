<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { signOut, type User } from 'firebase/auth'
import { auth } from '@/firebase'
import { fetchUserApp } from '@/services/userServices'
import { UserApp } from '@/models/UserModel'
import StatsNavBar from '@/components/navbar/StatsNavBar.vue'

const router = useRouter()

const loading = ref(true)
const userApp = ref<UserApp | null>(null)
const authUser = ref<User | null>(null)
const errorMessage = ref('')

const isGuest = computed(() => authUser.value?.isAnonymous ?? false)
const verified = computed(() => authUser.value?.emailVerified ?? false)

const sectionCount = computed(() => {
  if (!userApp.value) return 0
  return Object.keys(userApp.value.sections.sections).length
})

const createdDate = computed(() => {
  const ts = authUser.value?.metadata.creationTime
  return ts ? new Date(ts).toLocaleDateString() : '—'
})

const lastSignIn = computed(() => {
  const ts = authUser.value?.metadata.lastSignInTime
  return ts ? new Date(ts).toLocaleString() : '—'
})

onMounted(async () => {
  const user = auth.currentUser
  if (!user) {
    router.replace('/auth?mode=login')
    return
  }
  authUser.value = user

  if (user.isAnonymous) {
    loading.value = false
    return
  }

  try {
    userApp.value = await fetchUserApp(user)
  } catch (err) {
    errorMessage.value = 'Could not load account details.'
  } finally {
    loading.value = false
  }
})

async function handleSignOut() {
  await signOut(auth)
  router.replace('/auth?mode=login')
}
</script>

<template>
  <div class="grid min-h-screen grid-rows-[80px_1fr] bg-night text-cream">
    <StatsNavBar />
    <div class="flex items-start justify-center px-6 py-12">
      <div class="w-full max-w-[36rem]">
        <div class="mb-8">
          <h1 class="font-poppins text-[2rem] tracking-[0.08em] text-warm-white">ACCOUNT</h1>
          <p class="mt-2 text-[0.95rem] text-cream/70">Your profile and session details.</p>
        </div>

        <p
          v-if="errorMessage"
          class="mb-4 rounded-[0.5rem] border border-red-500/40 bg-red-500/10 px-4 py-3 text-[0.85rem] text-red-400"
        >
          {{ errorMessage }}
        </p>

        <div v-if="loading" class="text-[0.95rem] text-cream/60">Loading...</div>

        <div v-else class="grid gap-6">
          <!-- Guest users -->
          <div
            v-if="isGuest"
            class="rounded-[0.5rem] border border-cream/20 bg-cream/5 px-5 py-6"
          >
            <p class="text-[1rem] text-warm-white">You're signed in as a guest.</p>
            <p class="mt-2 text-[0.9rem] text-cream/60">
              Guest sessions don't save data between visits. Create an account to keep your
              work.
            </p>
            <RouterLink
              to="/auth?mode=signup"
              class="mt-4 inline-block rounded-[0.5rem] bg-coral px-5 py-2 text-[0.9rem] font-semibold text-night transition hover:bg-warm-white"
            >
              CREATE ACCOUNT
            </RouterLink>
          </div>

          <!-- Registered users -->
          <div v-else class="grid gap-4">
            <div class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 rounded-[0.5rem] border border-cream/20 px-5 py-5">
              <span class="text-[0.8rem] tracking-[0.08em] text-cream/50">NAME</span>
              <span class="text-[0.95rem] text-warm-white">
                {{ userApp?.name ?? authUser?.displayName ?? '—' }}
              </span>

              <span class="text-[0.8rem] tracking-[0.08em] text-cream/50">EMAIL</span>
              <span class="text-[0.95rem] text-warm-white">
                {{ authUser?.email ?? '—' }}
                <span
                  v-if="verified"
                  class="ml-2 rounded-full bg-green-500/20 px-2 py-0.5 text-[0.7rem] text-green-400"
                >
                  VERIFIED
                </span>
                <span
                  v-else
                  class="ml-2 rounded-full bg-yellow-500/20 px-2 py-0.5 text-[0.7rem] text-yellow-400"
                >
                  UNVERIFIED
                </span>
              </span>

              <span class="text-[0.8rem] tracking-[0.08em] text-cream/50">ROLE</span>
              <span class="text-[0.95rem] uppercase text-warm-white">
                {{ userApp?.role ?? '—' }}
              </span>

              <span class="text-[0.8rem] tracking-[0.08em] text-cream/50">USER ID</span>
              <span class="truncate font-mono text-[0.8rem] text-cream/70">
                {{ authUser?.uid ?? '—' }}
              </span>

              <span class="text-[0.8rem] tracking-[0.08em] text-cream/50">SECTIONS</span>
              <span class="text-[0.95rem] text-warm-white">{{ sectionCount }}</span>

              <span class="text-[0.8rem] tracking-[0.08em] text-cream/50">JOINED</span>
              <span class="text-[0.95rem] text-warm-white">{{ createdDate }}</span>

              <span class="text-[0.8rem] tracking-[0.08em] text-cream/50">LAST SIGN IN</span>
              <span class="text-[0.95rem] text-warm-white">{{ lastSignIn }}</span>
            </div>

            <RouterLink
              v-if="!verified"
              to="/verify-email"
              class="rounded-[0.5rem] border border-coral/40 bg-coral/10 px-4 py-3 text-center text-[0.9rem] text-coral transition hover:bg-coral/20"
            >
              Verify your email
            </RouterLink>
          </div>

          <button
            type="button"
            class="rounded-[0.5rem] border border-cream/30 py-3 text-[0.95rem] font-semibold text-cream transition hover:border-cream hover:bg-cream/10"
            @click="handleSignOut"
          >
            SIGN OUT
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
