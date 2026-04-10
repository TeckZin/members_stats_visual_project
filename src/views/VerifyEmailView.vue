<!-- src/views/VerifyEmailView.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { signOut, reload } from 'firebase/auth'
import { auth } from '@/firebase'
import { sendVerificationEmail } from '@/services/userServices'

const router = useRouter()

const loading = ref(false)
const checking = ref(false)
const errorMessage = ref('')
const infoMessage = ref('')
const cooldown = ref(0)

let pollInterval: ReturnType<typeof setInterval> | null = null
let cooldownInterval: ReturnType<typeof setInterval> | null = null

const userEmail = computed(() => auth.currentUser?.email ?? '')

async function checkVerification() {
  const user = auth.currentUser
  if (!user) {
    router.replace('/auth')
    return
  }
  checking.value = true
  try {
    await reload(user)
    if (user.emailVerified) {
      stopPolling()
      router.replace('/stats/dashboard')
    }
  } catch (err) {
    // Silent — polling will try again
  } finally {
    checking.value = false
  }
}

async function handleResend() {
  const user = auth.currentUser
  if (!user || cooldown.value > 0 || loading.value) return

  loading.value = true
  errorMessage.value = ''
  infoMessage.value = ''
  try {
    await sendVerificationEmail(user)
    infoMessage.value = 'Verification email sent. Check your inbox.'
    startCooldown(30)
  } catch (err: any) {
    if (err?.code === 'auth/too-many-requests') {
      errorMessage.value = 'Too many requests. Please wait a moment before trying again.'
      startCooldown(60)
    } else {
      errorMessage.value = 'Could not send verification email. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

async function handleSignOut() {
  stopPolling()
  await signOut(auth)
  router.replace('/auth')
}

function startCooldown(seconds: number) {
  cooldown.value = seconds
  cooldownInterval = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0 && cooldownInterval) {
      clearInterval(cooldownInterval)
      cooldownInterval = null
    }
  }, 1000)
}

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
    cooldownInterval = null
  }
}

onMounted(() => {
  const user = auth.currentUser
  if (!user) {
    router.replace('/auth')
    return
  }
  if (user.emailVerified) {
    router.replace('/stats/dashboard')
    return
  }
  // Poll every 5 seconds in case the user clicked the link in another tab
  pollInterval = setInterval(checkVerification, 5000)
})

onUnmounted(() => {
  stopPolling()
})
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-night px-6 py-10">
    <div class="w-full max-w-[28rem]">
      <div class="mb-8 text-center">
        <h1 class="text-[2rem] font-poppins tracking-[0.08em] text-warm-white">
          VERIFY YOUR EMAIL
        </h1>
        <p class="mt-3 text-[0.95rem] text-cream">
          We sent a verification link to
        </p>
        <p class="mt-1 text-[1rem] font-semibold text-warm-white">
          {{ userEmail }}
        </p>
        <p class="mt-4 text-[0.9rem] text-cream/70">
          Click the link in your email to activate your account. This page will
          refresh automatically once you're verified.
        </p>
      </div>

      <p
        v-if="errorMessage"
        class="mb-4 rounded-[0.5rem] border border-red-500/40 bg-red-500/10 px-4 py-3 text-[0.85rem] text-red-400"
      >
        {{ errorMessage }}
      </p>

      <p
        v-if="infoMessage"
        class="mb-4 rounded-[0.5rem] border border-coral/40 bg-coral/10 px-4 py-3 text-[0.85rem] text-coral"
      >
        {{ infoMessage }}
      </p>

      <div class="grid gap-3">
        <button
          type="button"
          :disabled="checking"
          class="rounded-[0.5rem] bg-coral py-3 text-[0.95rem] font-semibold text-night transition hover:bg-warm-white disabled:cursor-not-allowed disabled:opacity-40"
          @click="checkVerification"
        >
          {{ checking ? 'CHECKING...' : "I'VE VERIFIED MY EMAIL" }}
        </button>

        <button
          type="button"
          :disabled="loading || cooldown > 0"
          class="rounded-[0.5rem] border border-cream/30 py-3 text-[0.95rem] font-semibold text-cream transition hover:border-cream hover:bg-cream/10 disabled:cursor-not-allowed disabled:opacity-40"
          @click="handleResend"
        >
          <template v-if="cooldown > 0">RESEND IN {{ cooldown }}s</template>
          <template v-else-if="loading">SENDING...</template>
          <template v-else>RESEND VERIFICATION EMAIL</template>
        </button>
      </div>

      <div class="my-8 h-px bg-cream/20" />

      <p class="text-center text-[0.9rem] text-cream/60">
        Wrong account?
        <button
          type="button"
          class="ml-1 border-none bg-transparent font-semibold text-coral transition hover:text-warm-white"
          @click="handleSignOut"
        >
          Sign out
        </button>
      </p>
    </div>
  </div>
</template>
