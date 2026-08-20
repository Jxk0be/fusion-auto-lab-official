<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    subtitle?: string
    align?: 'left' | 'center'
    tone?: 'light' | 'dark'
  }>(),
  { align: 'left', tone: 'light' },
)
</script>

<template>
  <div :class="['max-w-2xl', align === 'center' && 'mx-auto text-center']">
    <p v-if="eyebrow" class="eyebrow text-accent-700" :class="tone === 'dark' && '!text-accent-400'">
      {{ eyebrow }}
    </p>
    <h2
      class="mt-3 text-3xl font-bold sm:text-4xl"
      :class="tone === 'dark' ? 'text-white' : 'text-ink-900'"
    >
      {{ title }}
    </h2>
    <p
      v-if="subtitle"
      class="mt-4 text-lg leading-relaxed"
      :class="tone === 'dark' ? 'text-ink-300' : 'text-ink-600'"
    >
      {{ subtitle }}
    </p>
    <slot />
  </div>
</template>
