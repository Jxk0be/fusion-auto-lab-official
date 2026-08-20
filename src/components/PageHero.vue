<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  subtitle?: string
}>()
</script>

<template>
  <section class="relative overflow-hidden bg-ink-950">
    <!-- Subtle diagonal sheen, kept low-contrast so it reads as texture -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.55]"
      style="
        background:
          radial-gradient(60rem 30rem at 15% -10%, rgb(56 200 248 / 0.16), transparent 60%),
          radial-gradient(50rem 28rem at 95% 110%, rgb(11 144 196 / 0.14), transparent 65%);
      "
      aria-hidden="true"
    />
    <div class="container-page relative py-14 sm:py-20">
      <p v-if="eyebrow" class="eyebrow text-accent-400">{{ eyebrow }}</p>
      <h1 class="mt-3 max-w-3xl text-4xl font-extrabold text-white sm:text-5xl">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-300">
        {{ subtitle }}
      </p>
      <slot />
    </div>
  </section>
</template>
