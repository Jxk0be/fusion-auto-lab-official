<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { navLinks, site } from '@/data/site'
import BaseIcon from './BaseIcon.vue'
import LogoMark from './LogoMark.vue'

const route = useRoute()
const menuOpen = ref(false)
const scrolled = ref(false)

const onScroll = () => (scrolled.value = window.scrollY > 8)
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.body.style.removeProperty('overflow')
})

watch(() => route.fullPath, () => (menuOpen.value = false))
watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
  <header class="sticky top-0 z-50">
    <!-- Utility bar: contact details always one tap away on desktop -->
    <div class="hidden border-b border-white/5 bg-black text-ink-400 lg:block">
      <div class="container-page flex h-10 items-center justify-between text-[0.8125rem]">
        <div class="flex items-center gap-6">
          <a
            :href="`tel:${site.phoneHref}`"
            class="flex items-center gap-2 transition hover:text-accent-400"
          >
            <BaseIcon name="phone" :size="14" />
            {{ site.phone }}
          </a>
          <a
            :href="`mailto:${site.email}`"
            class="flex items-center gap-2 transition hover:text-accent-400"
          >
            <BaseIcon name="mail" :size="14" />
            {{ site.email }}
          </a>
        </div>
        <div class="flex items-center gap-6">
          <span class="flex items-center gap-2">
            <BaseIcon name="clock" :size="14" />
            Open daily {{ site.hours }}
          </span>
          <a
            :href="site.mapsUrl"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 transition hover:text-accent-400"
          >
            <BaseIcon name="pin" :size="14" />
            {{ site.address.street }}, {{ site.address.city }}
          </a>
        </div>
      </div>
    </div>

    <!-- Main nav -->
    <div
      class="border-b bg-ink-950/95 backdrop-blur transition-colors duration-200"
      :class="scrolled || menuOpen ? 'border-white/10' : 'border-transparent'"
    >
      <nav
        class="container-page flex h-16 items-center justify-between gap-4 lg:h-20"
        aria-label="Main"
      >
        <RouterLink to="/" class="-m-1 shrink-0 rounded p-1" aria-label="Fusion Auto Lab — home">
          <LogoMark />
        </RouterLink>

        <ul class="hidden items-center gap-1 lg:flex">
          <li v-for="link in navLinks" :key="link.to">
            <RouterLink
              :to="link.to"
              class="rounded-md px-3.5 py-2 text-[0.9375rem] font-medium text-ink-300 transition hover:bg-white/5 hover:text-white"
              active-class="!text-white"
              exact-active-class="!text-white"
            >
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>

        <div class="hidden items-center gap-2.5 lg:flex">
          <a :href="`tel:${site.phoneHref}`" class="btn btn-ghost-light !py-2.5 !text-sm">
            <BaseIcon name="phone" :size="16" />
            Call
          </a>
          <RouterLink to="/contact" class="btn btn-primary !py-2.5 !text-sm">
            Get a Quote
          </RouterLink>
        </div>

        <!-- Mobile controls -->
        <div class="flex items-center gap-2 lg:hidden">
          <a
            :href="`tel:${site.phoneHref}`"
            class="btn btn-ghost-light !px-3 !py-2.5"
            aria-label="Call Fusion Auto Lab"
          >
            <BaseIcon name="phone" :size="18" />
          </a>
          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 text-white transition hover:bg-white/10"
            :aria-expanded="menuOpen"
            aria-controls="mobile-menu"
            :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
            @click="menuOpen = !menuOpen"
          >
            <BaseIcon :name="menuOpen ? 'close' : 'menu'" :size="22" />
          </button>
        </div>
      </nav>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="menuOpen"
        id="mobile-menu"
        class="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-white/10 bg-ink-950 shadow-xl lg:hidden"
      >
        <div class="container-page py-4">
          <ul class="space-y-1">
            <li v-for="link in navLinks" :key="link.to">
              <RouterLink
                :to="link.to"
                class="flex items-center justify-between rounded-lg px-3 py-3.5 text-base font-medium text-ink-300 transition hover:bg-white/5 hover:text-white"
                active-class="bg-white/5 !text-white"
              >
                {{ link.label }}
                <BaseIcon name="arrowRight" :size="16" class="text-ink-600" />
              </RouterLink>
            </li>
          </ul>

          <div class="mt-4 grid gap-2.5 border-t border-white/10 pt-4">
            <RouterLink to="/contact" class="btn btn-primary w-full">Get a Free Quote</RouterLink>
            <a :href="`tel:${site.phoneHref}`" class="btn btn-ghost-light w-full">
              <BaseIcon name="phone" :size="16" />
              {{ site.phone }}
            </a>
            <a :href="`mailto:${site.email}`" class="btn btn-ghost-light w-full">
              <BaseIcon name="mail" :size="16" />
              Email us
            </a>
          </div>

          <div class="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm text-ink-400">
            <p class="flex items-center gap-2">
              <BaseIcon name="clock" :size="15" />
              Open daily {{ site.hours }}
            </p>
            <a :href="site.mapsUrl" target="_blank" rel="noopener" class="flex items-center gap-2">
              <BaseIcon name="pin" :size="15" />
              {{ site.address.street }}, {{ site.address.city }}, {{ site.address.state }}
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
