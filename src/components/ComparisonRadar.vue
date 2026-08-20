<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ComparisonTrait } from '@/data/services'

const props = defineProps<{
  traits: readonly ComparisonTrait[]
  seriesNames: readonly string[]
  colors: readonly string[]
}>()

/* --- geometry -------------------------------------------------------------- */
const SIZE = 440
const CX = SIZE / 2
const CY = 205
const R = 128
const MAX = 10
const RINGS = [0.25, 0.5, 0.75, 1]

const angleFor = (i: number) => (Math.PI * 2 * i) / props.traits.length - Math.PI / 2
const pointAt = (i: number, ratio: number) => {
  const a = angleFor(i)
  return { x: CX + Math.cos(a) * R * ratio, y: CY + Math.sin(a) * R * ratio }
}

const axes = computed(() =>
  props.traits.map((trait, i) => {
    const outer = pointAt(i, 1)
    const label = pointAt(i, 1.24)
    const dx = label.x - CX
    const anchor = Math.abs(dx) < 4 ? 'middle' : dx > 0 ? 'start' : 'end'
    // Break long labels onto a second line so nothing runs off the chart
    const words = trait.label.split(' ')
    let lines = [trait.label]
    if (trait.label.length > 13 && words.length > 1) {
      let head = ''
      let idx = 0
      while (idx < words.length && (head + words[idx]).length <= trait.label.length / 2) {
        head += (head ? ' ' : '') + words[idx]
        idx += 1
      }
      lines = [head, words.slice(idx).join(' ')].filter(Boolean)
    }
    return { outer, label, anchor, lines, name: trait.label }
  }),
)

const ringPolygons = computed(() =>
  RINGS.map((ratio) =>
    props.traits
      .map((_, i) => {
        const p = pointAt(i, ratio)
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
      })
      .join(' '),
  ),
)

const seriesPaths = computed(() =>
  props.seriesNames.map((name, s) => ({
    name,
    color: props.colors[s % props.colors.length],
    points: props.traits
      .map((trait, i) => {
        const p = pointAt(i, (trait.scores[s] ?? 0) / MAX)
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
      })
      .join(' '),
    dots: props.traits.map((trait, i) => pointAt(i, (trait.scores[s] ?? 0) / MAX)),
  })),
)

/* --- legend toggling ------------------------------------------------------- */
const hidden = ref<Set<number>>(new Set())
const toggle = (index: number) => {
  const next = new Set(hidden.value)
  next.has(index) ? next.delete(index) : next.add(index)
  // Never let the user hide everything
  if (next.size < props.seriesNames.length) hidden.value = next
}
const isVisible = (index: number) => !hidden.value.has(index)
</script>

<template>
  <figure class="m-0">
    <svg
      :viewBox="`0 0 ${SIZE} 400`"
      class="mx-auto block h-auto w-full max-w-lg"
      role="img"
      :aria-label="`Radar chart comparing ${seriesNames.join(', ')} across ${traits.length} traits`"
    >
      <!-- grid rings -->
      <polygon
        v-for="(pts, i) in ringPolygons"
        :key="`ring-${i}`"
        :points="pts"
        fill="none"
        stroke="var(--color-ink-200)"
        stroke-width="1"
      />
      <polygon :points="ringPolygons[ringPolygons.length - 1]" fill="var(--color-ink-50)" opacity="0.6" />

      <!-- spokes -->
      <line
        v-for="(axis, i) in axes"
        :key="`spoke-${i}`"
        :x1="CX"
        :y1="CY"
        :x2="axis.outer.x"
        :y2="axis.outer.y"
        stroke="var(--color-ink-200)"
        stroke-width="1"
      />

      <!-- series -->
      <g v-for="(series, s) in seriesPaths" :key="series.name">
        <template v-if="isVisible(s)">
          <polygon
            :points="series.points"
            :fill="series.color"
            fill-opacity="0.12"
            :stroke="series.color"
            stroke-width="2.25"
            stroke-linejoin="round"
            :stroke-dasharray="s === 0 ? '5 4' : s === 2 ? '1 5' : undefined"
            stroke-linecap="round"
          />
          <circle
            v-for="(dot, i) in series.dots"
            :key="`${series.name}-${i}`"
            :cx="dot.x"
            :cy="dot.y"
            r="3.5"
            :fill="series.color"
            stroke="#fff"
            stroke-width="1.5"
          />
        </template>
      </g>

      <!-- axis labels -->
      <g class="font-sans" fill="var(--color-ink-600)" font-size="12.5" font-weight="600">
        <text
          v-for="(axis, i) in axes"
          :key="`label-${i}`"
          :x="axis.label.x"
          :y="axis.label.y"
          :text-anchor="axis.anchor"
          :dy="axis.lines.length > 1 ? -2 : 4"
        >
          <tspan
            v-for="(line, li) in axis.lines"
            :key="line"
            :x="axis.label.x"
            :dy="li === 0 ? 0 : 14"
          >
            {{ line }}
          </tspan>
        </text>
      </g>
    </svg>

    <!-- legend -->
    <figcaption class="mt-2">
      <ul class="flex flex-wrap items-center justify-center gap-2">
        <li v-for="(name, s) in seriesNames" :key="name">
          <button
            type="button"
            class="flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition"
            :class="
              isVisible(s)
                ? 'border-ink-200 bg-white text-ink-800 shadow-xs'
                : 'border-ink-100 bg-ink-50 text-ink-400'
            "
            :aria-pressed="isVisible(s)"
            @click="toggle(s)"
          >
            <span
              class="h-2.5 w-2.5 rounded-full"
              :style="{ backgroundColor: isVisible(s) ? colors[s] : 'var(--color-ink-300)' }"
            />
            {{ name }}
          </button>
        </li>
      </ul>
      <p class="mt-3 text-center text-xs text-ink-400">
        Tap a package to show or hide it. Scores are relative, on a 1–10 scale.
      </p>
    </figcaption>
  </figure>
</template>
