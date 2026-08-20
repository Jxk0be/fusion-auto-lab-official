<script setup lang="ts">
import type { ServicePackage } from '@/data/services'
import BaseIcon from './BaseIcon.vue'

defineProps<{ pkg: ServicePackage; accent: string }>()
</script>

<template>
  <article
    class="relative flex h-full flex-col rounded-2xl border bg-white p-6 transition duration-200 sm:p-7"
    :class="
      pkg.featured
        ? 'border-ink-900 shadow-lift lg:-my-2 lg:py-9'
        : 'border-ink-200 shadow-card hover:border-ink-300 hover:shadow-lift'
    "
  >
    <span
      v-if="pkg.featured"
      class="absolute -top-3 left-6 rounded-full bg-ink-900 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-white"
    >
      Most popular
    </span>

    <div class="flex items-center gap-2.5">
      <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: accent }" />
      <h3 class="text-xl font-bold text-ink-900">{{ pkg.name }}</h3>
    </div>
    <p class="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-600">{{ pkg.summary }}</p>

    <div class="mt-5 border-y border-ink-100 py-4">
      <p class="text-2xl font-bold text-ink-900">
        <template v-if="pkg.priceFrom">
          {{ pkg.priceFrom }}
          <span class="text-sm font-medium text-ink-400">to start</span>
        </template>
        <template v-else>
          <span class="text-xl">Request a quote</span>
        </template>
      </p>
      <p v-if="pkg.priceNote" class="mt-1 text-[0.8125rem] text-ink-500">{{ pkg.priceNote }}</p>
      <p class="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink-500">
        <BaseIcon name="clock" :size="15" />
        {{ pkg.turnaround }} in the shop
      </p>
    </div>

    <ul class="mt-5 flex-1 space-y-2.5">
      <li v-for="feature in pkg.features" :key="feature" class="flex gap-3 text-[0.9375rem]">
        <BaseIcon name="check" :size="17" :stroke-width="2.5" class="mt-0.5 text-accent-500" />
        <span class="text-ink-600">{{ feature }}</span>
      </li>
    </ul>

    <RouterLink
      :to="{ path: '/contact', query: { service: pkg.name } }"
      class="btn mt-7 w-full"
      :class="pkg.featured ? 'btn-primary' : 'btn-outline'"
    >
      Get a quote for {{ pkg.name }}
    </RouterLink>
  </article>
</template>
