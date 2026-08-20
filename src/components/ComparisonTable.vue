<script setup lang="ts">
import type { ComparisonTrait, ServicePackage } from '@/data/services'

defineProps<{
  traits: readonly ComparisonTrait[]
  packages: readonly ServicePackage[]
  colors: readonly string[]
}>()
</script>

<template>
  <div class="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
    <table class="w-full min-w-[42rem] border-collapse text-left">
      <caption class="sr-only">
        Side-by-side comparison of wrap packages, scored 1 to 10
      </caption>
      <thead>
        <tr class="border-b border-ink-200">
          <th scope="col" class="py-3.5 pr-4 text-sm font-semibold text-ink-500">Trait</th>
          <th
            v-for="(pkg, i) in packages"
            :key="pkg.id"
            scope="col"
            class="px-4 py-3.5 text-sm font-bold text-ink-900"
          >
            <span class="flex items-center gap-2">
              <span
                class="h-2.5 w-2.5 rounded-full"
                :style="{ backgroundColor: colors[i % colors.length] }"
              />
              {{ pkg.name }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="trait in traits"
          :key="trait.label"
          class="border-b border-ink-100 align-top last:border-0"
        >
          <th scope="row" class="max-w-56 py-4 pr-4 font-normal">
            <span class="block text-sm font-semibold text-ink-900">{{ trait.label }}</span>
            <span class="mt-1 block text-[0.8125rem] leading-relaxed text-ink-500">
              {{ trait.description }}
            </span>
          </th>
          <td v-for="(pkg, i) in packages" :key="pkg.id" class="px-4 py-4">
            <div class="flex items-center gap-2.5">
              <span class="h-1.5 w-16 overflow-hidden rounded-full bg-ink-100">
                <span
                  class="block h-full rounded-full"
                  :style="{
                    width: `${((trait.scores[i] ?? 0) / 10) * 100}%`,
                    backgroundColor: colors[i % colors.length],
                  }"
                />
              </span>
              <span class="text-sm font-semibold tabular-nums text-ink-700">
                {{ trait.scores[i] }}<span class="text-ink-300">/10</span>
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
