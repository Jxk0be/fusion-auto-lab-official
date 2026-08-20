<script setup lang="ts">
import { computed } from 'vue'
import CtaBand from '@/components/CtaBand.vue'
import FaqAccordion from '@/components/FaqAccordion.vue'
import PageHero from '@/components/PageHero.vue'
import { useJsonLd, useSeo } from '@/composables/useSeo'
import { faqs } from '@/data/faq'

useSeo({
  title: 'FAQ',
  description:
    'Answers to common questions about automotive liquid wrapping — durability, care, removal, pricing and turnaround times.',
  path: '/faq',
})

/** Helps the questions show up as rich results in Google. */
useJsonLd('faq-schema', {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
})

const categories = computed(() => {
  const order = ['The Basics', 'Care & Longevity', 'Booking & Pricing'] as const
  return order
    .map((name) => ({ name, items: faqs.filter((f) => f.category === name) }))
    .filter((group) => group.items.length > 0)
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="FAQ"
      title="Questions, answered"
      subtitle="Everything people usually want to know before handing over the keys. If yours is not here, just ask."
    />

    <section class="bg-white py-16 sm:py-20">
      <div class="container-page">
        <div class="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <!-- Jump links -->
          <nav class="lg:col-span-3" aria-label="FAQ sections">
            <p class="eyebrow text-ink-400">On this page</p>
            <ul class="mt-4 space-y-2 lg:sticky lg:top-28">
              <li v-for="group in categories" :key="group.name">
                <a
                  :href="`#${group.name.toLowerCase().replace(/[^a-z]+/g, '-')}`"
                  class="text-[0.9375rem] font-medium text-ink-600 transition hover:text-accent-700"
                >
                  {{ group.name }}
                </a>
              </li>
            </ul>
          </nav>

          <div class="space-y-14 lg:col-span-9">
            <section
              v-for="group in categories"
              :id="group.name.toLowerCase().replace(/[^a-z]+/g, '-')"
              :key="group.name"
              class="scroll-mt-28"
            >
              <h2 class="mb-5 text-2xl font-bold text-ink-900">{{ group.name }}</h2>
              <FaqAccordion :items="group.items" />
            </section>
          </div>
        </div>
      </div>
    </section>

    <CtaBand
      title="Still have a question?"
      subtitle="Send it over — we would rather answer it now than have you guess."
    />
  </div>
</template>
