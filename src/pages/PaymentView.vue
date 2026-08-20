<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue'
import PageHero from '@/components/PageHero.vue'
import { useSeo } from '@/composables/useSeo'
import { site } from '@/data/site'

useSeo({
  title: 'Make a Payment',
  description:
    'Pay Fusion Auto Lab for your liquid wrap deposit or balance. Questions about an invoice? Call (865) 320-1200.',
  path: '/payment',
})

const steps = [
  'Confirm the amount with us before sending anything — deposits and balances differ by job.',
  'Open the payment link below and enter the agreed amount.',
  'Put your name and vehicle in the note so we can match the payment to your job.',
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Payments"
      title="Make a payment"
      subtitle="Already have a quote or an invoice from us? You can send your deposit or balance here."
    />

    <section class="bg-white py-16 sm:py-20">
      <div class="container-page">
        <div class="mx-auto max-w-3xl">
          <div class="grid gap-6 sm:grid-cols-5">
            <!-- Payment card -->
            <div
              v-if="site.payment.enabled"
              class="rounded-2xl border border-ink-900 bg-ink-950 p-7 text-center shadow-lift sm:col-span-2 sm:text-left"
            >
              <p class="eyebrow text-accent-400">Pay by</p>
              <h2 class="mt-2 text-2xl font-bold text-white">{{ site.payment.label }}</h2>
              <p class="mt-3 text-[0.9375rem] leading-relaxed text-ink-400">
                Opens {{ site.payment.label }} in a new tab. Add your name and vehicle in the note.
              </p>
              <a
                :href="site.payment.url"
                target="_blank"
                rel="noopener"
                class="btn btn-primary mt-6 w-full"
              >
                Pay with {{ site.payment.label }}
                <BaseIcon name="external" :size="15" />
              </a>
            </div>

            <!-- How it works -->
            <div class="rounded-2xl border border-ink-200 bg-white p-7 shadow-card sm:col-span-3">
              <h2 class="text-xl font-bold text-ink-900">Before you send</h2>
              <ol class="mt-5 space-y-4">
                <li v-for="(step, i) in steps" :key="i" class="flex gap-3.5">
                  <span
                    class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white"
                  >
                    {{ i + 1 }}
                  </span>
                  <span class="text-[0.9375rem] leading-relaxed text-ink-600">{{ step }}</span>
                </li>
              </ol>
            </div>
          </div>

          <!-- In-person options -->
          <div class="mt-8 rounded-2xl border border-ink-200 bg-ink-50 p-7">
            <h2 class="text-lg font-bold text-ink-900">Paying at the shop</h2>
            <p class="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">
              You are always welcome to settle up in person when you pick up the vehicle. If you are
              not sure what you owe, or something on your invoice does not look right, call us
              before you send anything — we will sort it out.
            </p>
            <div class="mt-5 flex flex-col gap-3 sm:flex-row">
              <a :href="`tel:${site.phoneHref}`" class="btn btn-dark">
                <BaseIcon name="phone" :size="16" />
                {{ site.phone }}
              </a>
              <a :href="`mailto:${site.email}`" class="btn btn-outline">
                <BaseIcon name="mail" :size="16" />
                Email about an invoice
              </a>
            </div>
          </div>

          <p class="mt-8 text-center text-sm text-ink-400">
            Never send a payment to anyone claiming to be {{ site.name }} from a different account
            or link. When in doubt, call the shop at {{ site.phone }} first.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
