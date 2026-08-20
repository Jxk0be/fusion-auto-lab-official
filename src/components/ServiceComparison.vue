<script setup lang="ts">
import { ref } from 'vue'
import { comparison, packages } from '@/data/services'
import ComparisonBars from './ComparisonBars.vue'
import ComparisonRadar from './ComparisonRadar.vue'
import ComparisonTable from './ComparisonTable.vue'

/** One color per package, in the same order as `packages`. */
const colors = ['#8b96a1', '#16b0e8', '#e0a63a'] as const

const seriesNames = packages.map((p) => p.name)
const view = ref<'chart' | 'table'>('chart')
</script>

<template>
  <div class="rounded-2xl border border-ink-200 bg-white p-5 shadow-card sm:p-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-xl font-bold text-ink-900">How the packages compare</h3>
        <p class="mt-1.5 text-sm text-ink-500">
          Every package peels off clean — the difference is depth, durability and shop time.
        </p>
      </div>
      <div
        class="inline-flex shrink-0 self-start rounded-lg border border-ink-200 bg-ink-50 p-1"
        role="tablist"
        aria-label="Comparison view"
      >
        <button
          v-for="option in (['chart', 'table'] as const)"
          :key="option"
          type="button"
          role="tab"
          :aria-selected="view === option"
          class="rounded-md px-4 py-1.5 text-sm font-semibold capitalize transition"
          :class="view === option ? 'bg-white text-ink-900 shadow-xs' : 'text-ink-500 hover:text-ink-800'"
          @click="view = option"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <div class="mt-7">
      <template v-if="view === 'chart'">
        <!-- Radar reads well with room; bars read better on a phone -->
        <div class="hidden sm:block">
          <ComparisonRadar :traits="comparison.traits" :series-names="seriesNames" :colors="colors" />
        </div>
        <div class="sm:hidden">
          <ComparisonBars :traits="comparison.traits" :series-names="seriesNames" :colors="colors" />
        </div>
      </template>
      <ComparisonTable
        v-else
        :traits="comparison.traits"
        :packages="packages"
        :colors="colors"
      />
    </div>
  </div>
</template>
