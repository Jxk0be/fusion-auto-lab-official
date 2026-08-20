<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue'
import { useSeo } from '@/composables/useSeo'
import { navLinks, site } from '@/data/site'

useSeo({
  title: 'Page not found',
  description: 'That page does not exist. Head back to the Fusion Auto Lab home page.',
})
</script>

<template>
  <section class="bg-white">
    <div class="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p class="font-display text-6xl font-extrabold text-ink-200 sm:text-7xl">404</p>
      <h1 class="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">This page took a wrong turn</h1>
      <p class="mt-4 max-w-md text-lg text-ink-600">
        The page you were after does not exist — but everything else is right here.
      </p>

      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <RouterLink to="/" class="btn btn-primary">Back to home</RouterLink>
        <a :href="`tel:${site.phoneHref}`" class="btn btn-outline">
          <BaseIcon name="phone" :size="16" />
          {{ site.phone }}
        </a>
      </div>

      <ul class="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        <li v-for="link in navLinks" :key="link.to">
          <RouterLink :to="link.to" class="font-medium text-ink-500 transition hover:text-accent-700">
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>
