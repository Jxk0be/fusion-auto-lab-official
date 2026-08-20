<script setup lang="ts">
import { useRoute } from 'vue-router'
import { site } from '@/data/site'
import BaseIcon from './BaseIcon.vue'

const route = useRoute()
</script>

<template>
  <!-- Persistent bottom bar on phones: the two actions that matter most. -->
  <div
    v-if="route.name !== 'contact'"
    class="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
  >
    <div class="grid grid-cols-2 gap-2.5 px-4 py-3">
      <RouterLink to="/contact" class="btn btn-primary w-full !py-3">Get a Quote</RouterLink>
      <a :href="`tel:${site.phoneHref}`" class="btn btn-ghost-light w-full !py-3">
        <BaseIcon name="phone" :size="16" />
        Call
      </a>
    </div>
  </div>
</template>
