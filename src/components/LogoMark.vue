<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * The logo lockup: the atom/wheel mark next to the wordmark.
 *
 * Both files are generated from the original artwork by `scripts/build-logos.py`
 * and live in /public. The mark's tire is dark art that was drawn on black, so
 * the lockup is designed for DARK surfaces — that's why the header and footer
 * are dark. If a file is missing, a typographic fallback renders instead.
 *
 * On very narrow phones the wordmark drops away and the mark stands alone,
 * so the header never runs out of room next to the call and menu buttons.
 */
const props = withDefaults(defineProps<{ size?: 'header' | 'footer' }>(), {
  size: 'header',
})

const markSrc = '/logo-mark.png'
const wordSrc = '/logo-wordmark.png'
const markOk = ref(true)
const wordOk = ref(true)

const markClass = computed(() =>
  props.size === 'footer' ? 'h-11 sm:h-12' : 'h-9 lg:h-11',
)
const wordClass = computed(() =>
  props.size === 'footer' ? 'h-5 sm:h-[1.375rem]' : 'hidden h-4 min-[380px]:block lg:h-5',
)
</script>

<template>
  <span class="inline-flex items-center gap-2.5">
    <img
      v-if="markOk"
      :src="markSrc"
      alt=""
      class="w-auto object-contain"
      :class="markClass"
      @error="markOk = false"
    />

    <img
      v-if="wordOk"
      :src="wordSrc"
      alt=""
      class="w-auto object-contain"
      :class="wordClass"
      @error="wordOk = false"
    />

    <!-- Fallback if the logo files aren't there -->
    <span
      v-if="!markOk"
      class="font-display leading-none text-white"
      :class="size === 'footer' ? 'text-lg' : 'text-base'"
    >
      <span class="block font-extrabold tracking-tight">FUSION</span>
      <span class="mt-0.5 block text-[0.6em] font-semibold tracking-[0.28em] text-accent-400">
        AUTO LAB
      </span>
    </span>

    <span class="sr-only">Fusion Auto Lab</span>
  </span>
</template>
