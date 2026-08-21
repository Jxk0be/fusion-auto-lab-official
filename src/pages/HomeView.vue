<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue'
import CtaBand from '@/components/CtaBand.vue'
import FaqAccordion from '@/components/FaqAccordion.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import ServiceCard from '@/components/ServiceCard.vue'
import ServiceComparison from '@/components/ServiceComparison.vue'
import { useSeo } from '@/composables/useSeo'
import { faqs } from '@/data/faq'
import { galleryItems } from '@/data/gallery'
import { processSteps, valueProps } from '@/data/process'
import { packages } from '@/data/services'
import { site } from '@/data/site'

useSeo({
  title: 'Automotive Liquid Wrapping in Knoxville, TN',
  description: site.blurb,
  path: '/',
})

const packageColors = ['#8b96a1', '#16b0e8', '#e0a63a']

/** Finish swatches for the hero panel — edit freely as the color menu grows. */
const finishes = [
  { name: 'Gloss', css: 'linear-gradient(140deg, #3a4148 0%, #14171a 55%, #2a3036 100%)' },
  { name: 'Satin', css: 'linear-gradient(140deg, #7d868f 0%, #4d555c 60%, #6b747c 100%)' },
  { name: 'Matte', css: 'linear-gradient(140deg, #2b2f33 0%, #23272a 100%)' },
  { name: 'Metallic', css: 'linear-gradient(140deg, #74d7f9 0%, #16b0e8 45%, #0c5f85 100%)' },
  { name: 'Pearl', css: 'linear-gradient(140deg, #eef1f4 0%, #c3ccd4 55%, #e6ebef 100%)' },
  { name: 'Color-shift', css: 'linear-gradient(140deg, #16b0e8 0%, #2f9c7d 45%, #7d5fa8 100%)' },
]

const homeFaqs = faqs.slice(0, 4)
const galleryPreview = galleryItems.slice(0, 3)
</script>

<template>
  <div>
    <!-- ================= Hero ================= -->
    <section class="relative overflow-hidden bg-ink-950">
      <div
        class="pointer-events-none absolute inset-0"
        style="
          background:
            radial-gradient(45rem 30rem at 12% 0%, rgb(56 200 248 / 0.20), transparent 62%),
            radial-gradient(40rem 26rem at 88% 100%, rgb(11 144 196 / 0.20), transparent 65%);
        "
        aria-hidden="true"
      />
      <div class="container-page relative py-16 sm:py-24 lg:py-28">
        <div class="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div class="lg:col-span-7">
            <p
              class="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-[0.8125rem] font-medium text-ink-300"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-accent-400" />
              Knoxville, TN · Mon–Fri {{ site.hours }}
            </p>

            <h1 class="mt-6 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              A new color for your car.
              <span class="text-ink-400">Without touching the paint.</span>
            </h1>

            <p class="mt-6 max-w-xl text-lg leading-relaxed text-ink-300">
              {{ site.blurb }}
            </p>

            <div class="mt-9 flex flex-col gap-3 sm:flex-row">
              <RouterLink to="/contact" class="btn btn-primary sm:min-w-48">
                Get a Free Quote
                <BaseIcon name="arrowRight" :size="17" />
              </RouterLink>
              <RouterLink to="/services" class="btn btn-ghost-light sm:min-w-48">
                See packages &amp; pricing
              </RouterLink>
            </div>

            <dl class="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-7">
              <div>
                <dt class="text-[0.6875rem] font-bold uppercase tracking-wider text-ink-500">
                  Finish
                </dt>
                <dd class="mt-1.5 text-[0.9375rem] font-semibold text-white">Seamless</dd>
              </div>
              <div>
                <dt class="text-[0.6875rem] font-bold uppercase tracking-wider text-ink-500">
                  Paint
                </dt>
                <dd class="mt-1.5 text-[0.9375rem] font-semibold text-white">Protected</dd>
              </div>
              <div>
                <dt class="text-[0.6875rem] font-bold uppercase tracking-wider text-ink-500">
                  Change
                </dt>
                <dd class="mt-1.5 text-[0.9375rem] font-semibold text-white">Reversible</dd>
              </div>
            </dl>
          </div>

          <!-- Finish swatch panel -->
          <div class="lg:col-span-5">
            <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm sm:p-6">
              <p class="eyebrow text-ink-400">Finishes we spray</p>
              <ul class="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
                <li v-for="finish in finishes" :key="finish.name">
                  <span
                    class="block aspect-square w-full rounded-xl ring-1 ring-inset ring-white/15"
                    :style="{ background: finish.css }"
                    aria-hidden="true"
                  />
                  <span class="mt-2 block text-center text-xs font-medium text-ink-400">
                    {{ finish.name }}
                  </span>
                </li>
              </ul>
              <p class="mt-6 border-t border-white/10 pt-5 text-sm leading-relaxed text-ink-400">
                Solids, metallics, pearls and color-shift — plus custom matches. Bring us a color
                and we will work out how to get there.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= Why liquid wrap ================= -->
    <section class="border-b border-ink-100 bg-white py-16 sm:py-20 lg:py-24">
      <div class="container-page">
        <SectionHeading
          eyebrow="Why liquid wrap"
          title="Paint-like results, wrap-like removability, all at a fraction of the cost."
          subtitle="A sprayed coating gets into the places film cannot, and comes back off whenever you want it to."
        />
        <ul class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="prop in valueProps"
            :key="prop.title"
            class="rounded-xl border border-ink-200 bg-white p-6 shadow-card transition hover:border-ink-300 hover:shadow-lift"
          >
            <span
              class="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-ink-900 text-accent-400"
            >
              <BaseIcon :name="prop.icon" :size="21" />
            </span>
            <h3 class="mt-5 text-lg font-bold text-ink-900">{{ prop.title }}</h3>
            <p class="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{{ prop.body }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- ================= Packages ================= -->
    <section class="bg-ink-50 py-16 sm:py-20 lg:py-24">
      <div class="container-page">
        <SectionHeading
          eyebrow="Services"
          title="Three ways to do it"
          subtitle="Same clean removal on every job — the difference is finish depth, durability and shop time."
        />
        <div class="mt-12 grid gap-6 lg:grid-cols-3">
          <ServiceCard
            v-for="(pkg, i) in packages"
            :key="pkg.id"
            :pkg="pkg"
            :accent="packageColors[i]"
          />
        </div>
        <div class="mt-10 text-center">
          <RouterLink to="/services" class="btn btn-outline">
            See everything we offer
            <BaseIcon name="arrowRight" :size="16" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ================= Comparison ================= -->
    <section class="bg-white py-16 sm:py-20 lg:py-24">
      <div class="container-page">
        <SectionHeading
          eyebrow="Compare"
          title="Which package fits your car?"
          subtitle="An honest look at the trade-offs. More layers buy depth and durability; fewer layers buy speed."
          align="center"
        />
        <div class="mt-12">
          <ServiceComparison />
        </div>
      </div>
    </section>

    <!-- ================= Process ================= -->
    <section class="bg-ink-950 py-16 sm:py-20 lg:py-24">
      <div class="container-page">
        <SectionHeading
          eyebrow="The process"
          title="What happens after you reach out"
          subtitle="No mystery, no surprise charges. Here is the whole job, start to finish."
          tone="dark"
        />
        <ol class="mt-12 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-6">
          <li v-for="step in processSteps" :key="step.step" class="relative">
            <span class="font-display text-sm font-bold tracking-widest text-accent-400">
              {{ step.step }}
            </span>
            <h3 class="mt-2 text-lg font-bold text-white">{{ step.title }}</h3>
            <p class="mt-2 text-[0.9375rem] leading-relaxed text-ink-400">{{ step.body }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ================= Gallery preview ================= -->
    <section class="bg-white py-16 sm:py-20 lg:py-24">
      <div class="container-page">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Portfolio"
            title="Recent work"
            subtitle="Every job gets photographed before it leaves the shop."
          />
          <RouterLink to="/gallery" class="btn btn-outline shrink-0">
            View the gallery
            <BaseIcon name="arrowRight" :size="16" />
          </RouterLink>
        </div>

        <ul class="mt-10 grid gap-4 sm:grid-cols-3">
          <li v-for="item in galleryPreview" :key="item.id">
            <div class="overflow-hidden rounded-xl border border-ink-200">
              <div class="aspect-[4/3] w-full">
                <img
                  v-if="item.src"
                  :src="item.src"
                  :alt="item.alt ?? item.title"
                  loading="lazy"
                  class="h-full w-full object-cover"
                />
                <div
                  v-else
                  class="flex h-full w-full flex-col items-center justify-center gap-2 bg-ink-100/70 text-ink-400"
                  style="
                    background-image: repeating-linear-gradient(
                      135deg,
                      transparent,
                      transparent 10px,
                      rgb(16 19 21 / 0.025) 10px,
                      rgb(16 19 21 / 0.025) 20px
                    );
                  "
                >
                  <BaseIcon name="image" :size="24" />
                  <span class="text-xs font-semibold uppercase tracking-wider">
                    Photo coming soon
                  </span>
                </div>
              </div>
              <div class="border-t border-ink-200 bg-white p-4">
                <p class="text-[0.9375rem] font-bold text-ink-900">{{ item.title }}</p>
                <p class="mt-0.5 text-sm text-ink-500">{{ item.detail }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- ================= FAQ preview ================= -->
    <section class="bg-ink-50 py-16 sm:py-20 lg:py-24">
      <div class="container-page">
        <div class="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div class="lg:col-span-4">
            <SectionHeading
              eyebrow="Common questions"
              title="Good to know"
              subtitle="The things people ask us most before booking."
            />
            <RouterLink to="/faq" class="btn btn-outline mt-7">
              Read all FAQs
              <BaseIcon name="arrowRight" :size="16" />
            </RouterLink>
          </div>
          <div class="lg:col-span-8">
            <FaqAccordion :items="homeFaqs" />
          </div>
        </div>
      </div>
    </section>

    <CtaBand />
  </div>
</template>
