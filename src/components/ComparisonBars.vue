<script setup lang="ts">
import type { ComparisonTrait } from '@/data/services'

defineProps<{
  traits: readonly ComparisonTrait[]
  seriesNames: readonly string[]
  colors: readonly string[]
}>()
</script>

<template>
  <!-- Bar view: easier to read than a radar on a narrow screen -->
  <div class="space-y-7">
    <div v-for="trait in traits" :key="trait.label">
      <p class="text-sm font-bold text-ink-900">{{ trait.label }}</p>
      <p class="mt-1 text-[0.8125rem] leading-relaxed text-ink-500">{{ trait.description }}</p>
      <ul class="mt-3 space-y-2">
        <li v-for="(name, s) in seriesNames" :key="name" class="flex items-center gap-3">
          <span class="w-20 shrink-0 text-xs font-semibold text-ink-600">{{ name }}</span>
          <span class="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
            <span
              class="block h-full rounded-full transition-[width] duration-500"
              :style="{
                width: `${((trait.scores[s] ?? 0) / 10) * 100}%`,
                backgroundColor: colors[s % colors.length],
              }"
            />
          </span>
          <span class="w-6 shrink-0 text-right text-xs font-semibold tabular-nums text-ink-400">
            {{ trait.scores[s] }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
