<script setup lang="ts">
//auth view
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth'
import { auth } from '@/firebase'
import {
  createUserDoc,
  fetchUserApp,
  sendVerificationEmail,
} from '@/services/userServices'
import { Role } from '@/models/UserModel'
import BaseButton from '@/components/BaseButton.vue'
import EyeOpenIcon from '@/assets/icon/EyeOpenIcon.vue'
import EyeOffIcon from '@/assets/icon/EyeOffIcon.vue'

type AuthMode = 'login' | 'signup'

const route = useRoute()
const router = useRouter()

const currMode = ref<AuthMode>(route.query.mode === 'signup' ? 'signup' : 'login')

watch(
  () => route.query.mode,
  (newMode) => {
    if (newMode === 'login' || newMode === 'signup') {
      currMode.value = newMode
    }
  },
)

const loginForm = ref({
  email: '',
  password: '',
  remember: false,
})

const signupForm = ref({
  username: '',
  email: '',
  password: '',
  passwordConf: '',
})

const showLoginPassword = ref(false)
const showSignupPassword = ref(false)
const showSignupConfirmPassword = ref(false)

const loading = ref(false)
const errorMessage = ref('')
const infoMessage = ref('')

const passwordMatch = computed(() => {
  if (!signupForm.value.passwordConf) return true
  return signupForm.value.password === signupForm.value.passwordConf
})

const loginValid = computed(() => {
  const value = loginForm.value
  return !!(value.email && value.password)
})

const signupValid = computed(() => {
  const value = signupForm.value
  return !!(
    value.username &&
    value.email &&
    value.password &&
    value.passwordConf &&
    passwordMatch.value
  )
})

function setMode(newMode: AuthMode) {
  currMode.value = newMode
  errorMessage.value = ''
  infoMessage.value = ''
  router.replace({
    query: {
      ...route.query,
      mode: newMode,
    },
  })
}

function mapFirebaseError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

async function handleLogin() {
  if (!loginValid.value || loading.value) return
  loading.value = true
  errorMessage.value = ''
  infoMessage.value = ''
  try {
    await setPersistence(
      auth,
      loginForm.value.remember ? browserLocalPersistence : browserSessionPersistence,
    )
    const cred = await signInWithEmailAndPassword(
      auth,
      loginForm.value.email,
      loginForm.value.password,
    )
    const userApp = await fetchUserApp(cred.user)
    if (!userApp) {
      // Edge case: auth user exists but no Firestore doc — create one
      await createUserDoc(cred.user, cred.user.displayName ?? 'User', Role.Customer)
    }
    // If they haven't verified yet, send them to the verify page
    if (!cred.user.emailVerified) {
      router.push('/verify-email')
    } else {
      router.push('/stats/dashboard')
    }
  } catch (err: any) {
    errorMessage.value = mapFirebaseError(err?.code ?? '')
  } finally {
    loading.value = false
  }
}

async function handleSignUp() {
  if (!signupValid.value || loading.value) return
  loading.value = true
  errorMessage.value = ''
  infoMessage.value = ''
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      signupForm.value.email,
      signupForm.value.password,
    )
    await updateProfile(cred.user, { displayName: signupForm.value.username })
    await createUserDoc(cred.user, signupForm.value.username, Role.Customer)
    await sendVerificationEmail(cred.user)
    router.push('/verify-email')
  } catch (err: any) {
    errorMessage.value = mapFirebaseError(err?.code ?? '')
  } finally {
    loading.value = false
  }
}

async function handleGuest() {
  if (loading.value) return
  loading.value = true
  errorMessage.value = ''
  infoMessage.value = ''
  try {
    await signInAnonymously(auth)
    router.push('/stats/dashboard')
  } catch (err: any) {
    errorMessage.value = mapFirebaseError(err?.code ?? '')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-night px-6 py-10">
    <div class="w-full max-w-[28rem]">
      <div class="mb-8 text-center">
        <h1 class="text-[2rem] font-poppins tracking-[0.08em] text-warm-white">
          {{ currMode === 'login' ? 'WELCOME BACK' : 'JOIN THE CREW' }}
        </h1>
        <p class="mt-3 text-[0.95rem] text-cream">
          {{ currMode === 'login' ? 'Sign in to continue.' : 'Create your account.' }}
        </p>
      </div>

      <div class="mb-8 grid grid-cols-2 gap-2">
        <BaseButton
          variant="second"
          size="md"
          :hover="true"
          :active="currMode === 'login'"
          @click="setMode('login')"
        >
          LOG IN
        </BaseButton>

        <BaseButton
          variant="second"
          size="md"
          :hover="true"
          :active="currMode === 'signup'"
          @click="setMode('signup')"
        >
          SIGN UP
        </BaseButton>
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

      <form v-if="currMode === 'login'" class="grid gap-5" @submit.prevent="handleLogin">
        <div>
          <label for="login-email" class="mb-2 block text-[0.8rem] tracking-[0.08em] text-cream">
            EMAIL
          </label>
          <input
            id="login-email"
            v-model="loginForm.email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            class="w-full rounded-[0.5rem] border border-cream/30 bg-transparent px-4 py-3 text-[1rem] text-warm-white outline-none placeholder:text-cream/40 focus:border-coral"
          />
        </div>

        <div>
          <label for="login-password" class="mb-2 block text-[0.8rem] tracking-[0.08em] text-cream">
            PASSWORD
          </label>

          <div class="relative">
            <input
              id="login-password"
              v-model="loginForm.password"
              :type="showLoginPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full rounded-[0.5rem] border border-cream/30 bg-transparent px-4 py-3 pr-12 text-[1rem] text-warm-white outline-none placeholder:text-cream/40 focus:border-coral"
            />

            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-cream/50 hover:text-cream"
              @click="showLoginPassword = !showLoginPassword"
            >
              <EyeOpenIcon v-if="!showLoginPassword" />
              <EyeOffIcon v-else />
            </button>
          </div>
        </div>

        <label class="flex items-center gap-2 text-[0.85rem] text-cream/70">
          <input v-model="loginForm.remember" type="checkbox" class="h-4 w-4 accent-coral" />
          Remember me
        </label>

        <button
          type="submit"
          :disabled="!loginValid || loading"
          class="rounded-[0.5rem] bg-coral py-3 text-[0.95rem] font-semibold text-night transition hover:bg-warm-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {{ loading ? 'SIGNING IN...' : 'SIGN IN' }}
        </button>
      </form>

      <form v-else class="grid gap-5" @submit.prevent="handleSignUp">
        <div>
          <label
            for="signup-username"
            class="mb-2 block text-[0.8rem] tracking-[0.08em] text-cream"
          >
            USERNAME
          </label>
          <input
            id="signup-username"
            v-model="signupForm.username"
            type="text"
            autocomplete="username"
            placeholder="cooluser42"
            class="w-full rounded-[0.5rem] border border-cream/30 bg-transparent px-4 py-3 text-[1rem] text-warm-white outline-none placeholder:text-cream/40 focus:border-coral"
          />
        </div>

        <div>
          <label for="signup-email" class="mb-2 block text-[0.8rem] tracking-[0.08em] text-cream">
            EMAIL
          </label>
          <input
            id="signup-email"
            v-model="signupForm.email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            class="w-full rounded-[0.5rem] border border-cream/30 bg-transparent px-4 py-3 text-[1rem] text-warm-white outline-none placeholder:text-cream/40 focus:border-coral"
          />
        </div>

        <div>
          <label
            for="signup-password"
            class="mb-2 block text-[0.8rem] tracking-[0.08em] text-cream"
          >
            PASSWORD
          </label>

          <div class="relative">
            <input
              id="signup-password"
              v-model="signupForm.password"
              :type="showSignupPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="••••••••"
              class="w-full rounded-[0.5rem] border border-cream/30 bg-transparent px-4 py-3 pr-12 text-[1rem] text-warm-white outline-none placeholder:text-cream/40 focus:border-coral"
            />

            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-cream/50 hover:text-cream"
              @click="showSignupPassword = !showSignupPassword"
            >
              <EyeOpenIcon v-if="!showSignupPassword" />
              <EyeOffIcon v-else />
            </button>
          </div>
        </div>

        <div>
          <label for="signup-confirm" class="mb-2 block text-[0.8rem] tracking-[0.08em] text-cream">
            CONFIRM PASSWORD
          </label>

          <div class="relative">
            <input
              id="signup-confirm"
              v-model="signupForm.passwordConf"
              :type="showSignupConfirmPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="••••••••"
              class="w-full rounded-[0.5rem] border bg-transparent px-4 py-3 pr-12 text-[1rem] text-warm-white outline-none placeholder:text-cream/40"
              :class="
                passwordMatch
                  ? 'border-cream/30 focus:border-coral'
                  : 'border-red-500 focus:border-red-500'
              "
            />

            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-cream/50 hover:text-cream"
              @click="showSignupConfirmPassword = !showSignupConfirmPassword"
            >
              <EyeOpenIcon v-if="!showSignupConfirmPassword" />
              <EyeOffIcon v-else />
            </button>
          </div>

          <p v-if="!passwordMatch" class="mt-2 text-[0.85rem] text-red-400">
            Passwords do not match
          </p>
        </div>

        <button
          type="submit"
          :disabled="!signupValid || loading"
          class="rounded-[0.5rem] bg-coral py-3 text-[0.95rem] font-semibold text-night transition hover:bg-warm-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {{ loading ? 'CREATING...' : 'CREATE ACCOUNT' }}
        </button>
      </form>

      <div class="my-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div class="h-px bg-cream/20" />
        <span class="text-[0.8rem] tracking-[0.08em] text-cream/40">OR</span>
        <div class="h-px bg-cream/20" />
      </div>

      <button
        type="button"
        :disabled="loading"
        class="w-full rounded-[0.5rem] border border-cream py-3 text-[0.95rem] font-semibold text-cream transition hover:border-transparent hover:bg-warm-white hover:text-night disabled:cursor-not-allowed disabled:opacity-40"
        @click="handleGuest"
      >
        CONTINUE AS GUEST
      </button>

      <p class="mt-8 text-center text-[0.9rem] text-cream/60">
        <template v-if="currMode === 'login'">
          Don't have an account?
          <button
            type="button"
            class="ml-1 border-none bg-transparent font-semibold text-coral transition hover:text-warm-white"
            @click="setMode('signup')"
          >
            Sign up
          </button>
        </template>

        <template v-else>
          Already have an account?
          <button
            type="button"
            class="ml-1 border-none bg-transparent font-semibold text-coral transition hover:text-warm-white"
            @click="setMode('login')"
          >
            Log in
          </button>
        </template>
      </p>
    </div>
  </div>
</template>
