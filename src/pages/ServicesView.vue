<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue'
import CtaBand from '@/components/CtaBand.vue'
import PageHero from '@/components/PageHero.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import ServiceCard from '@/components/ServiceCard.vue'
import { useSeo } from '@/composables/useSeo'
import { processSteps } from '@/data/process'
import { addOns, packages } from '@/data/services'

useSeo({
  title: 'Services & Pricing',
  description:
    'Liquid wrap packages for full color changes, wheels, chrome delete and trim accents. Gloss, satin, matte, metallic and custom finishes — request a quote.',
  path: '/services',
})

const packageColors = ['#8b96a1', '#16b0e8', '#e0a63a']
</script>

<template>
  <div>
    <PageHero
      eyebrow="Services"
      title="Liquid wrap packages built around what you actually want"
      subtitle="Pick a full color change, or start small with wheels, trim or a chrome delete. Everything is quoted after we see the vehicle, so the number you get is the number you pay."
    />

    <!-- Packages -->
    <section class="bg-white py-16 sm:py-20">
      <div class="container-page">
        <SectionHeading
          eyebrow="Full vehicle"
          title="Wrap packages"
          subtitle="Every package includes wash, decontamination, full masking and a clean-peeling finish. The tiers add depth, protection and finishing work."
        />
        <div class="mt-12 grid gap-6 lg:grid-cols-3">
          <ServiceCard
            v-for="(pkg, i) in packages"
            :key="pkg.id"
            :pkg="pkg"
            :accent="packageColors[i]"
          />
        </div>
        <p class="mt-8 text-sm text-ink-500">
          Pricing depends on vehicle size, paint condition, finish and how much disassembly the job
          needs — a lifted truck in a candy fade is a very different job from a coupe in solid
          satin. Send us the details and we will quote it properly.
        </p>
      </div>
    </section>

    <!-- Comparison section removed pending a new design. The chart components
         and the `comparison` data in services.ts are still in place — drop the
         section back in here to restore it. -->

    <!-- Add-ons -->
    <section class="bg-ink-50 py-16 sm:py-20">
      <div class="container-page">
        <SectionHeading
          eyebrow="A la carte"
          title="Smaller jobs, same standards"
          subtitle="Not ready for a full color change? These are the quickest ways to change how the car reads."
        />
        <ul class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="addOn in addOns"
            :key="addOn.id"
            class="flex flex-col rounded-xl border border-ink-200 bg-white p-6 shadow-card transition hover:border-ink-300 hover:shadow-lift"
          >
            <h3 class="text-lg font-bold text-ink-900">{{ addOn.name }}</h3>
            <p class="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-ink-600">
              {{ addOn.description }}
            </p>
            <p class="mt-4 text-sm font-semibold text-ink-900">
              {{ addOn.priceFrom ? `From ${addOn.priceFrom}` : 'Request a quote' }}
            </p>
            <RouterLink
              :to="{ path: '/contact', query: { service: addOn.name } }"
              class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700 transition hover:text-accent-800"
            >
              Ask about {{ addOn.name.toLowerCase() }}
              <BaseIcon name="arrowRight" :size="15" />
            </RouterLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- Process -->
    <section class="bg-ink-950 py-16 sm:py-20">
      <div class="container-page">
        <SectionHeading
          eyebrow="How it works"
          title="From first message to keys back in your hand"
          tone="dark"
        />
        <ol class="mt-12 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-6">
          <li v-for="step in processSteps" :key="step.step">
            <span class="font-display text-sm font-bold tracking-widest text-accent-400">
              {{ step.step }}
            </span>
            <h3 class="mt-2 text-lg font-bold text-white">{{ step.title }}</h3>
            <p class="mt-2 text-[0.9375rem] leading-relaxed text-ink-400">{{ step.body }}</p>
          </li>
        </ol>
      </div>
    </section>

    <CtaBand
      title="Not sure which package you need?"
      subtitle="Tell us the vehicle and the look you are going for. We will tell you honestly what it takes to get there."
    />
  </div>
</template>
