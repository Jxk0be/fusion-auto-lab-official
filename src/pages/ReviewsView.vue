<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue'
import CtaBand from '@/components/CtaBand.vue'
import PageHero from '@/components/PageHero.vue'
import { useSeo } from '@/composables/useSeo'
import { site } from '@/data/site'
import { testimonials } from '@/data/testimonials'

useSeo({
  title: 'Reviews',
  description:
    'What customers say about Fusion Auto Lab — automotive liquid wrapping in Knoxville, TN.',
  path: '/reviews',
})

const instagram = site.socials[0]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Reviews"
      title="What customers say"
      subtitle="Straight from the people who trusted us with their vehicles."
    />

    <section class="bg-white py-16 sm:py-20">
      <div class="container-page">
        <!-- Reviews exist -->
        <ul v-if="testimonials.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="(review, i) in testimonials"
            :key="i"
            class="flex flex-col rounded-xl border border-ink-200 bg-white p-6 shadow-card"
          >
            <div v-if="review.rating" class="flex gap-0.5 text-accent-500" aria-hidden="true">
              <BaseIcon
                v-for="star in review.rating"
                :key="star"
                name="star"
                :size="17"
                stroke-width="1.5"
                class="fill-current"
              />
            </div>
            <span v-if="review.rating" class="sr-only">{{ review.rating }} out of 5 stars</span>

            <blockquote class="mt-4 flex-1 text-[1.0625rem] leading-relaxed text-ink-700">
              &ldquo;{{ review.quote }}&rdquo;
            </blockquote>

            <footer class="mt-5 border-t border-ink-100 pt-4">
              <p class="font-bold text-ink-900">{{ review.name }}</p>
              <p class="mt-0.5 text-sm text-ink-500">
                <span v-if="review.vehicle">{{ review.vehicle }}</span>
                <span v-if="review.vehicle && review.service"> · </span>
                <span v-if="review.service">{{ review.service }}</span>
              </p>
              <p v-if="review.source" class="mt-1 text-xs uppercase tracking-wider text-ink-400">
                via {{ review.source }}
              </p>
            </footer>
          </li>
        </ul>

        <!-- No reviews yet — say so plainly rather than faking any -->
        <div
          v-else
          class="mx-auto max-w-2xl rounded-2xl border border-ink-200 bg-ink-50 p-8 text-center sm:p-12"
        >
          <span
            class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink-900 text-accent-400"
          >
            <BaseIcon name="star" :size="24" />
          </span>
          <h2 class="mt-6 text-2xl font-bold text-ink-900">Be our next review</h2>
          <p class="mt-3 leading-relaxed text-ink-600">
            We are a young shop and we are building this page the honest way — with real reviews
            from real customers, as they come in. Nothing here is made up, and nothing will be.
          </p>
          <p class="mt-3 leading-relaxed text-ink-600">
            If we have worked on your vehicle, we would genuinely appreciate a few words. And if
            you are deciding whether to book, come by the shop — we will show you the work in
            person.
          </p>
          <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <RouterLink to="/contact" class="btn btn-primary">Get a Free Quote</RouterLink>
            <a
              v-if="instagram"
              :href="instagram.url"
              target="_blank"
              rel="noopener"
              class="btn btn-outline"
            >
              <BaseIcon name="instagram" :size="16" />
              See us on Instagram
            </a>
          </div>
        </div>
      </div>
    </section>

    <CtaBand />
  </div>
</template>
