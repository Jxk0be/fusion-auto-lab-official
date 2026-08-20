<script setup lang="ts">
import { site } from '@/data/site'
import BaseIcon from './BaseIcon.vue'

withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
  }>(),
  {
    title: 'Ready to change the color of your vehicle?',
    subtitle:
      'Tell us what you drive and the finish you have in mind. We will get back to you with a real quote — no obligation.',
  },
)
</script>

<template>
  <section class="bg-ink-900">
    <div class="container-page py-14 sm:py-16">
      <div class="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-2xl">
          <h2 class="text-2xl font-bold text-white sm:text-3xl">{{ title }}</h2>
          <p class="mt-3 text-[1.0625rem] leading-relaxed text-ink-300">{{ subtitle }}</p>
        </div>
        <div class="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:shrink-0">
          <RouterLink to="/contact" class="btn btn-primary sm:min-w-44">
            Get a Free Quote
            <BaseIcon name="arrowRight" :size="17" />
          </RouterLink>
          <a :href="`tel:${site.phoneHref}`" class="btn btn-ghost-light sm:min-w-44">
            <BaseIcon name="phone" :size="16" />
            {{ site.phone }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
