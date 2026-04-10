<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'first' | 'second'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: ButtonVariant
    size?: ButtonSize
    hover?: boolean
    active?: boolean
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'first',
    size: 'md',
    hover: true,
    active: false,
    disabled: false,
  },
)

const baseClass = 'rounded-[0.5rem] font-semibold tracking-[0.08em] transition duration-300'

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-4 py-2 text-[0.8rem]'
    case 'lg':
      return 'px-8 py-4 text-[1rem]'
    case 'md':
    default:
      return 'px-6 py-3 text-[0.9rem]'
  }
})

const hoverClass = 'hover:bg-warm-white hover:text-night hover:border-transparent'

const variantClass = computed(() => {
  if (props.active) {
    return 'bg-coral text-night border border-coral'
  }

  if (props.variant === 'first') {
    return props.hover
      ? `bg-coral text-night border border-coral ${hoverClass}`
      : 'bg-coral text-night border border-coral'
  }

  return props.hover
    ? `bg-transparent text-cream border border-cream ${hoverClass}`
    : 'bg-transparent text-cream border border-cream'
})
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    :class="[
      baseClass,
      sizeClass,
      variantClass,
      props.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    ]"
  >
    <slot />
  </button>
</template>
