<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import MobileCallBar from '@/components/MobileCallBar.vue'
</script>

<template>
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
  >
    Skip to content
  </a>

  <div class="flex min-h-dvh flex-col">
    <AppHeader />

    <main id="main" class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter />

    <!-- Keeps the fixed mobile action bar from covering the footer -->
    <div class="h-[4.75rem] lg:hidden" aria-hidden="true" />
    <MobileCallBar />
  </div>
</template>
