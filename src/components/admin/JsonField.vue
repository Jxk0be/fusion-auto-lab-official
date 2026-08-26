<script setup lang="ts">
import { computed } from 'vue'
import { HELP, HIDDEN_KEYS, LONG_TEXT_KEYS, labelFor } from '@/admin/schema'
import BaseIcon from '@/components/BaseIcon.vue'

/**
 * Renders one value from the content JSON as an editable control, recursing
 * into objects and arrays.
 *
 * Driven by the shape of the data rather than a hand-written form, so a field
 * added to the JSON shows up in the editor automatically — nobody has to
 * remember to update two places.
 */
const props = withDefaults(
  defineProps<{
    modelValue: unknown
    fieldKey?: string
    depth?: number
    /** Allowed values, when this field is one of a fixed set. */
    options?: string[]
    /** Fixed-value options for the keys of items in this array. */
    enumOptions?: Record<string, string[]>
  }>(),
  { fieldKey: '', depth: 0, options: undefined, enumOptions: undefined },
)

const emit = defineEmits<{ 'update:modelValue': [unknown] }>()

const label = computed(() => (props.fieldKey ? labelFor(props.fieldKey) : ''))
const help = computed(() => HELP[props.fieldKey])
const isLongText = computed(
  () =>
    LONG_TEXT_KEYS.has(props.fieldKey) ||
    (typeof props.modelValue === 'string' && props.modelValue.length > 90),
)

const kind = computed(() => {
  const v = props.modelValue
  if (Array.isArray(v)) return 'array'
  if (v !== null && typeof v === 'object') return 'object'
  if (typeof v === 'boolean') return 'boolean'
  if (typeof v === 'number') return 'number'
  return 'string'
})

/** Object entries, minus anything the schema keeps out of the way. */
const visibleEntries = computed(() =>
  Object.entries((props.modelValue ?? {}) as Record<string, unknown>).filter(
    ([key]) => !HIDDEN_KEYS.has(key),
  ),
)

const updateKey = (key: string, value: unknown) => {
  emit('update:modelValue', { ...(props.modelValue as object), [key]: value })
}

const items = computed(() => (props.modelValue as unknown[]) ?? [])

/**
 * Keys whose values across this array come from a small fixed set — a FAQ's
 * section, a gallery item's category. Offering those as a dropdown stops two
 * failures that are invisible until someone looks at the live site: a typo
 * that creates a new orphan group, and a blank left on a newly added row,
 * which drops the item off the page entirely.
 */
const enumOptionsForItems = computed<Record<string, string[]>>(() => {
  const objects = items.value.filter(
    (i) => i !== null && typeof i === 'object' && !Array.isArray(i),
  ) as Record<string, unknown>[]
  if (objects.length < 2) return {}

  const result: Record<string, string[]> = {}
  for (const key of Object.keys(objects[0])) {
    const values = objects.map((o) => o[key])
    if (!values.every((v) => typeof v === 'string' && v.trim())) continue
    const distinct = [...new Set(values as string[])]
    // Few enough to be a set of choices, and repeated enough to look deliberate.
    if (distinct.length >= 1 && distinct.length <= 8 && distinct.length < objects.length) {
      result[key] = distinct.sort()
    }
  }
  return result
})

const updateIndex = (index: number, value: unknown) => {
  const next = [...items.value]
  next[index] = value
  emit('update:modelValue', next)
}

const removeIndex = (index: number) => {
  const next = [...items.value]
  next.splice(index, 1)
  emit('update:modelValue', next)
}

const move = (index: number, by: number) => {
  const target = index + by
  if (target < 0 || target >= items.value.length) return
  const next = [...items.value]
  ;[next[index], next[target]] = [next[target], next[index]]
  emit('update:modelValue', next)
}

/** A new row shaped like the existing ones, so nothing arrives half-formed. */
const addItem = () => {
  const template = items.value[0]
  let blank: unknown = ''
  if (template !== undefined && template !== null && typeof template === 'object') {
    blank = Object.fromEntries(
      Object.entries(template as Record<string, unknown>).map(([k, v]) => [
        k,
        // A fixed-set field starts on a real value rather than blank, so a new
        // row is never invisible on the site just because it was left alone.
        enumOptionsForItems.value[k]?.[0] ??
          (Array.isArray(v) ? [] : typeof v === 'boolean' ? false : typeof v === 'number' ? 0 : ''),
      ]),
    )
  }
  emit('update:modelValue', [...items.value, blank])
}

/** A short, human summary for a collapsed row's header. */
const summarise = (item: unknown, index: number): string => {
  if (typeof item === 'string') return item || `Item ${index + 1}`
  if (item && typeof item === 'object') {
    const o = item as Record<string, unknown>
    for (const key of ['name', 'title', 'question', 'label', 'days', 'step']) {
      if (typeof o[key] === 'string' && o[key]) return o[key] as string
    }
  }
  return `Item ${index + 1}`
}

const inputClass =
  'w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-[0.9375rem] text-ink-900 transition hover:border-ink-300 focus:border-accent-500'
</script>

<template>
  <!-- Primitives -->
  <div v-if="kind === 'boolean'" class="flex items-start gap-3">
    <input
      :id="`f-${fieldKey}-${depth}`"
      type="checkbox"
      :checked="modelValue as boolean"
      class="mt-0.5 h-4 w-4 accent-accent-600"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <label :for="`f-${fieldKey}-${depth}`" class="text-[0.9375rem] text-ink-800">
      {{ label }}
      <span v-if="help" class="mt-0.5 block text-[0.8125rem] text-ink-500">{{ help }}</span>
    </label>
  </div>

  <div v-else-if="kind === 'number'">
    <label class="mb-1.5 block text-sm font-semibold text-ink-800">{{ label }}</label>
    <input
      type="number"
      :value="modelValue as number"
      :class="inputClass"
      @input="emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
    />
    <p v-if="help" class="mt-1 text-[0.8125rem] text-ink-500">{{ help }}</p>
  </div>

  <div v-else-if="kind === 'string'">
    <label v-if="label" class="mb-1.5 block text-sm font-semibold text-ink-800">{{ label }}</label>
    <select
      v-if="options?.length"
      :value="modelValue as string"
      :class="inputClass"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
      <!-- keeps a value that predates the current set from being silently lost -->
      <option v-if="!options.includes(modelValue as string)" :value="modelValue as string">
        {{ modelValue || '(empty)' }}
      </option>
    </select>
    <textarea
      v-else-if="isLongText"
      :value="modelValue as string"
      rows="3"
      :class="inputClass"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <input
      v-else
      type="text"
      :value="modelValue as string"
      :class="inputClass"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="help" class="mt-1 text-[0.8125rem] text-ink-500">{{ help }}</p>
  </div>

  <!-- Arrays -->
  <div v-else-if="kind === 'array'">
    <p v-if="label" class="mb-2 text-sm font-semibold text-ink-800">{{ label }}</p>
    <p v-if="help" class="mb-2 text-[0.8125rem] text-ink-500">{{ help }}</p>

    <ul class="space-y-3">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="rounded-lg border border-ink-200 bg-ink-50/60 p-3"
      >
        <div class="mb-2 flex items-center justify-between gap-2">
          <span class="truncate text-[0.8125rem] font-semibold text-ink-500">
            {{ summarise(item, index) }}
          </span>
          <span class="flex shrink-0 items-center gap-1">
            <button
              type="button"
              class="rounded p-1 text-ink-400 transition hover:bg-white hover:text-ink-800 disabled:opacity-30"
              :disabled="index === 0"
              aria-label="Move up"
              @click="move(index, -1)"
            >
              <BaseIcon name="chevronDown" :size="15" class="rotate-180" />
            </button>
            <button
              type="button"
              class="rounded p-1 text-ink-400 transition hover:bg-white hover:text-ink-800 disabled:opacity-30"
              :disabled="index === items.length - 1"
              aria-label="Move down"
              @click="move(index, 1)"
            >
              <BaseIcon name="chevronDown" :size="15" />
            </button>
            <button
              type="button"
              class="rounded p-1 text-ink-400 transition hover:bg-white hover:text-red-600"
              aria-label="Remove"
              @click="removeIndex(index)"
            >
              <BaseIcon name="close" :size="15" />
            </button>
          </span>
        </div>

        <JsonField
          :model-value="item"
          :depth="depth + 1"
          :enum-options="enumOptionsForItems"
          @update:model-value="updateIndex(index, $event)"
        />
      </li>
    </ul>

    <button
      type="button"
      class="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-ink-300 px-3 py-2 text-sm font-semibold text-ink-600 transition hover:border-ink-400 hover:text-ink-900"
      @click="addItem"
    >
      + Add {{ label ? label.toLowerCase().replace(/s$/, '') : 'item' }}
    </button>
  </div>

  <!-- Objects -->
  <div v-else :class="depth > 0 ? 'space-y-4' : 'space-y-6'">
    <p v-if="label && depth > 0" class="text-sm font-semibold text-ink-800">{{ label }}</p>
    <div
      v-for="[key, value] in visibleEntries"
      :key="key"
      :class="depth === 0 ? 'rounded-xl border border-ink-200 bg-white p-5' : ''"
    >
      <JsonField
        :model-value="value"
        :field-key="key"
        :depth="depth + 1"
        :options="enumOptions?.[key]"
        @update:model-value="updateKey(key, $event)"
      />
    </div>
  </div>
</template>
