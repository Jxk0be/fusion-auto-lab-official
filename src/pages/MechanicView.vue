<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue'
import PageHero from '@/components/PageHero.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import { useSeo } from '@/composables/useSeo'
import { mechanic } from '@/data/mechanic'
import { site } from '@/data/site'

useSeo({
  title: 'Auto Mechanic Services',
  description: `General auto repair in Knoxville, TN at ${mechanic.hourlyRate} an hour flat labor. Call ${site.phone} during business hours and find out straight away whether it's a job we can take on.`,
  path: '/auto-mechanic-services',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Auto Mechanic Services"
      title="General repair work, billed straight by the hour"
      subtitle="Alongside the wrap work, the shop takes on general mechanical repair. One flat labor rate, an honest answer about whether your job is a fit, and no padding on the bill."
    />

    <!-- ================= Rate ================= -->
    <section class="bg-white py-16 sm:py-20">
      <div class="container-page">
        <div class="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <!-- Rate card -->
          <div class="lg:col-span-5">
            <div class="rounded-2xl border border-ink-900 bg-ink-950 p-8 shadow-lift">
              <p class="eyebrow text-accent-400">Labor rate</p>
              <p class="mt-4 flex items-baseline gap-2">
                <span class="font-display text-6xl font-extrabold text-white">
                  {{ mechanic.hourlyRate }}
                </span>
                <span class="text-lg font-medium text-ink-400">{{ mechanic.rateUnit }}</span>
              </p>
              <p v-if="mechanic.rateComparison" class="mt-4 text-[0.9375rem] leading-relaxed text-accent-200">
                {{ mechanic.rateComparison }}
              </p>
              <p class="mt-5 border-t border-white/10 pt-5 text-[0.9375rem] leading-relaxed text-ink-400">
                Parts are billed at cost on top of labor. You are welcome to supply your own — just
                say so when you call, and see the
                <RouterLink to="/terms" class="font-semibold text-white underline">terms</RouterLink>
                for how that works.
              </p>
              <a :href="`tel:${site.phoneHref}`" class="btn btn-primary mt-7 w-full">
                <BaseIcon name="phone" :size="17" />
                Call {{ site.phone }}
              </a>
            </div>
          </div>

          <!-- How it works -->
          <div class="lg:col-span-7">
            <SectionHeading
              eyebrow="How it works"
              title="Call first — it saves us both a trip"
              subtitle="This is a working shop, not a dealership service department. Some jobs need equipment that isn't here, and the fastest way to find out is a quick phone call."
            />

            <ul class="mt-9 space-y-7">
              <li v-for="promise in mechanic.promises" :key="promise.title" class="flex gap-4">
                <span
                  class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-accent-400"
                >
                  <BaseIcon :name="promise.icon" :size="20" />
                </span>
                <div>
                  <h3 class="text-lg font-bold text-ink-900">{{ promise.title }}</h3>
                  <p class="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-600">
                    {{ promise.body }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= Jobs ================= -->
    <section class="bg-ink-50 py-16 sm:py-20">
      <div class="container-page">
        <SectionHeading
          eyebrow="What comes through the shop"
          title="Jobs people call about"
          subtitle="A starting point, not a menu. Most general repair work is on the table — but call and I'll tell you straight whether I've got what your particular job needs."
        />

        <ul class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="job in mechanic.jobs"
            :key="job.name"
            class="rounded-xl border border-ink-200 bg-white p-6 shadow-card transition hover:border-ink-300 hover:shadow-lift"
          >
            <h3 class="text-[1.0625rem] font-bold text-ink-900">{{ job.name }}</h3>
            <p class="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{{ job.description }}</p>
          </li>
        </ul>

        <div
          class="mt-8 flex flex-col gap-4 rounded-xl border border-ink-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex gap-4">
            <span
              class="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-accent-400 sm:inline-flex"
            >
              <BaseIcon name="wrench" :size="20" />
            </span>
            <div>
              <p class="font-bold text-ink-900">Don't see your job listed?</p>
              <p class="mt-1 max-w-xl text-[0.9375rem] leading-relaxed text-ink-600">
                Call anyway. The list above is just what comes up most — I can handle most general
                repair work, and if yours isn't a fit you'll know inside of two minutes.
              </p>
            </div>
          </div>
          <a :href="`tel:${site.phoneHref}`" class="btn btn-dark shrink-0">
            <BaseIcon name="phone" :size="16" />
            {{ site.phone }}
          </a>
        </div>
      </div>
    </section>

    <!-- ================= Referral ================= -->
    <section class="bg-white py-16 sm:py-20">
      <div class="container-page">
        <div
          class="overflow-hidden rounded-2xl border border-ink-200 bg-ink-950 shadow-lift"
        >
          <div class="grid gap-8 p-8 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-12">
            <div class="lg:col-span-8">
              <p class="eyebrow text-accent-400">Referrals</p>
              <h2 class="mt-3 text-2xl font-bold text-white sm:text-3xl">
                {{ mechanic.referral.headline }}
              </h2>
              <p class="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-300">
                {{ mechanic.referral.body }}
              </p>
            </div>
            <div class="lg:col-span-4">
              <div
                class="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 py-8 text-center"
              >
                <span class="font-display text-5xl font-extrabold text-accent-400">
                  {{ mechanic.referral.percent }}
                </span>
                <span class="mt-2 text-sm font-semibold uppercase tracking-wider text-ink-400">
                  of the labor
                </span>
                <a :href="`tel:${site.phoneHref}`" class="btn btn-primary mt-6 w-full !py-3">
                  Send me a job
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= CTA ================= -->
    <section class="bg-ink-900">
      <div class="container-page py-14 sm:py-16">
        <div class="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div class="max-w-2xl">
            <h2 class="text-2xl font-bold text-white sm:text-3xl">
              Got something that needs looking at?
            </h2>
            <p class="mt-3 text-[1.0625rem] leading-relaxed text-ink-300">
              Calling is the fastest way to get an answer on repair work — {{ site.hoursShort }}.
              If it's easier to type it out, the quote form works too.
            </p>
          </div>
          <div class="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:shrink-0">
            <a :href="`tel:${site.phoneHref}`" class="btn btn-primary sm:min-w-44">
              <BaseIcon name="phone" :size="16" />
              {{ site.phone }}
            </a>
            <RouterLink to="/contact" class="btn btn-ghost-light sm:min-w-44">
              Send a message
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
