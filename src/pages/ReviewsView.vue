<script setup lang="ts">
import { computed } from 'vue'
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

/**
 * Three reviews in a three-column grid look considered; one review stranded in
 * the left-hand column looks like something failed to load. The owner adds
 * these one at a time, so the layout has to hold up at every count.
 */
const gridClass = computed(() => {
  const count = testimonials.length
  if (count === 1) return 'mx-auto max-w-2xl'
  if (count === 2) return 'mx-auto max-w-4xl sm:grid-cols-2'
  return 'sm:grid-cols-2 lg:grid-cols-3'
})

const rated = computed(() => testimonials.filter((t) => typeof t.rating === 'number' && t.rating > 0))

const averageRating = computed(() =>
  rated.value.length
    ? Math.round((rated.value.reduce((sum, t) => sum + (t.rating ?? 0), 0) / rated.value.length) * 10) / 10
    : 0,
)

/** Only worth summarising once there is more than one score to average. */
const showSummary = computed(() => rated.value.length >= 2)
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
        <div v-if="showSummary" class="mb-10 flex flex-wrap items-center justify-center gap-3 text-center">
          <span class="flex gap-0.5 text-accent-500" aria-hidden="true">
            <BaseIcon
              v-for="star in 5"
              :key="star"
              name="star"
              :size="20"
              stroke-width="1.5"
              :class="star <= Math.round(averageRating) ? 'fill-current' : 'text-ink-300'"
            />
          </span>
          <p class="text-[1.0625rem] text-ink-700">
            <span class="font-bold text-ink-900">{{ averageRating }} out of 5</span>
            from {{ rated.length }} {{ rated.length === 1 ? 'review' : 'reviews' }}
          </p>
        </div>

        <ul v-if="testimonials.length" class="grid gap-6" :class="gridClass">
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
              <p class="font-bold text-ink-900">
                {{ review.name || 'Verified customer' }}
              </p>
              <p v-if="review.vehicle || review.service" class="mt-0.5 text-sm text-ink-500">
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
