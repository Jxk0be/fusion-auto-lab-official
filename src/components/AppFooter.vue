<script setup lang="ts">
import { fullAddress, navLinks, site } from '@/data/site'
import BaseIcon from './BaseIcon.vue'
import LogoMark from './LogoMark.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-ink-950 text-ink-400">
    <div class="container-page py-14 lg:py-20">
      <div class="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <!-- Brand -->
        <div class="lg:col-span-5">
          <LogoMark size="footer" />
          <p class="mt-5 max-w-sm text-[0.9375rem] leading-relaxed">
            {{ site.blurb }}
          </p>
          <div class="mt-6 flex items-center gap-3">
            <a
              v-for="social in site.socials"
              :key="social.label"
              :href="social.url"
              target="_blank"
              rel="noopener"
              class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-ink-300 transition hover:border-white/40 hover:text-white"
              :aria-label="`${site.name} on ${social.label}`"
            >
              <BaseIcon name="instagram" :size="19" />
            </a>
          </div>
        </div>

        <!-- Links -->
        <div class="lg:col-span-3">
          <h3 class="eyebrow text-white">Explore</h3>
          <ul class="mt-5 space-y-3 text-[0.9375rem]">
            <li v-for="link in navLinks" :key="link.to">
              <RouterLink :to="link.to" class="transition hover:text-white">
                {{ link.label }}
              </RouterLink>
            </li>
            <li v-if="site.payment.enabled">
              <RouterLink to="/payment" class="transition hover:text-white">
                Make a Payment
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="lg:col-span-4">
          <h3 class="eyebrow text-white">Visit or Call</h3>
          <ul class="mt-5 space-y-4 text-[0.9375rem]">
            <li>
              <a
                :href="`tel:${site.phoneHref}`"
                class="flex items-start gap-3 transition hover:text-white"
              >
                <BaseIcon name="phone" :size="17" class="mt-0.5 text-accent-400" />
                {{ site.phone }}
              </a>
            </li>
            <li>
              <a
                :href="`mailto:${site.email}`"
                class="flex items-start gap-3 break-all transition hover:text-white"
              >
                <BaseIcon name="mail" :size="17" class="mt-0.5 text-accent-400" />
                {{ site.email }}
              </a>
            </li>
            <li>
              <a
                :href="site.mapsUrl"
                target="_blank"
                rel="noopener"
                class="flex items-start gap-3 transition hover:text-white"
              >
                <BaseIcon name="pin" :size="17" class="mt-0.5 text-accent-400" />
                <span>{{ fullAddress }}</span>
              </a>
            </li>
            <li class="flex items-start gap-3">
              <BaseIcon name="clock" :size="17" class="mt-0.5 text-accent-400" />
              <span>Open daily · {{ site.hours }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <p>&copy; {{ year }} {{ site.name }}. All rights reserved.</p>
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
          <RouterLink to="/privacy" class="transition hover:text-white">Privacy Policy</RouterLink>
          <RouterLink to="/terms" class="transition hover:text-white">Terms of Service</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>
