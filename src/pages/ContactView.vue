<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue'
import ContactForm from '@/components/ContactForm.vue'
import PageHero from '@/components/PageHero.vue'
import { useSeo } from '@/composables/useSeo'
import { fullAddress, site } from '@/data/site'

useSeo({
  title: 'Contact & Free Quote',
  description:
    'Request a liquid wrap quote from Fusion Auto Lab in Knoxville, TN. Call (865) 320-1200, email info@fusionautolab.com, or send the quote form. Open Monday to Friday, 10 AM to 6 PM.',
  path: '/contact',
})

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`
</script>

<template>
  <div>
    <PageHero
      eyebrow="Contact"
      title="Let's talk about your vehicle"
      subtitle="The quote form is the fastest way to reach us — it gives us everything we need to give you a real number. Prefer to talk? Call or email any time during business hours."
    />

    <section class="bg-ink-50 py-16 sm:py-20">
      <div class="container-page">
        <div class="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <!-- Form -->
          <div class="lg:col-span-7">
            <h2 class="text-2xl font-bold text-ink-900">Request a free quote</h2>
            <p class="mt-2 text-ink-600">
              Takes about a minute. We reply during business hours.
            </p>
            <div class="mt-6">
              <ContactForm />
            </div>
          </div>

          <!-- Details -->
          <aside class="lg:col-span-5">
            <div class="rounded-2xl border border-ink-200 bg-white p-6 shadow-card sm:p-8">
              <h2 class="text-xl font-bold text-ink-900">Shop details</h2>

              <ul class="mt-6 space-y-5">
                <li>
                  <a
                    :href="`tel:${site.phoneHref}`"
                    class="group flex items-start gap-4 transition hover:text-accent-700"
                  >
                    <span
                      class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-accent-400"
                    >
                      <BaseIcon name="phone" :size="18" />
                    </span>
                    <span>
                      <span class="block text-[0.8125rem] font-semibold uppercase tracking-wider text-ink-400">
                        Phone
                      </span>
                      <span class="mt-0.5 block text-[1.0625rem] font-semibold text-ink-900 group-hover:text-accent-700">
                        {{ site.phone }}
                      </span>
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    :href="`mailto:${site.email}`"
                    class="group flex items-start gap-4 transition hover:text-accent-700"
                  >
                    <span
                      class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-accent-400"
                    >
                      <BaseIcon name="mail" :size="18" />
                    </span>
                    <span class="min-w-0">
                      <span class="block text-[0.8125rem] font-semibold uppercase tracking-wider text-ink-400">
                        Email
                      </span>
                      <span class="mt-0.5 block break-all font-semibold text-ink-900 group-hover:text-accent-700">
                        {{ site.email }}
                      </span>
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    :href="site.mapsUrl"
                    target="_blank"
                    rel="noopener"
                    class="group flex items-start gap-4 transition hover:text-accent-700"
                  >
                    <span
                      class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-accent-400"
                    >
                      <BaseIcon name="pin" :size="18" />
                    </span>
                    <span>
                      <span class="block text-[0.8125rem] font-semibold uppercase tracking-wider text-ink-400">
                        Address
                      </span>
                      <span class="mt-0.5 block font-semibold text-ink-900 group-hover:text-accent-700">
                        {{ site.address.street }}<br />
                        {{ site.address.city }}, {{ site.address.state }} {{ site.address.zip }}
                      </span>
                    </span>
                  </a>
                </li>

                <li class="flex items-start gap-4">
                  <span
                    class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-accent-400"
                  >
                    <BaseIcon name="clock" :size="18" />
                  </span>
                  <span class="flex-1">
                    <span class="block text-[0.8125rem] font-semibold uppercase tracking-wider text-ink-400">
                      Hours
                    </span>
                    <dl class="mt-1.5 space-y-1 text-[0.9375rem]">
                      <div
                        v-for="row in site.hoursDetail"
                        :key="row.days"
                        class="flex justify-between gap-4"
                      >
                        <dt class="text-ink-600">{{ row.days }}</dt>
                        <dd class="font-semibold text-ink-900">{{ row.time }}</dd>
                      </div>
                    </dl>
                  </span>
                </li>
              </ul>

              <div v-if="site.socials.length" class="mt-7 border-t border-ink-100 pt-6">
                <p class="text-[0.8125rem] font-semibold uppercase tracking-wider text-ink-400">
                  Follow the builds
                </p>
                <a
                  v-for="social in site.socials"
                  :key="social.label"
                  :href="social.url"
                  target="_blank"
                  rel="noopener"
                  class="mt-3 inline-flex items-center gap-2 font-semibold text-ink-900 transition hover:text-accent-700"
                >
                  <BaseIcon name="instagram" :size="18" />
                  {{ social.handle }}
                  <BaseIcon name="external" :size="14" class="text-ink-400" />
                </a>
              </div>
            </div>

            <!-- Map -->
            <div class="mt-6 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
              <iframe
                :src="mapSrc"
                class="h-64 w-full border-0 sm:h-72"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Map showing the Fusion Auto Lab shop location"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>
