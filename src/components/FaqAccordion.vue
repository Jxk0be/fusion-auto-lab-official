<script setup lang="ts">
import { ref } from 'vue'
import type { FaqItem } from '@/data/faq'
import BaseIcon from './BaseIcon.vue'

defineProps<{ items: FaqItem[] }>()

const openIndex = ref<string | null>(null)
const toggle = (key: string) => {
  openIndex.value = openIndex.value === key ? null : key
}

/**
 * Height animation driven from the real content height, so answers of any
 * length open and close smoothly without a hard-coded max-height.
 */
const el = (raw: Element) => raw as HTMLElement

const onBeforeEnter = (raw: Element) => {
  const node = el(raw)
  node.style.height = '0px'
  node.style.opacity = '0'
}
const onEnter = (raw: Element) => {
  const node = el(raw)
  node.style.height = `${node.scrollHeight}px`
  node.style.opacity = '1'
}
const onAfterEnter = (raw: Element) => {
  el(raw).style.height = 'auto'
}
const onBeforeLeave = (raw: Element) => {
  const node = el(raw)
  node.style.height = `${node.scrollHeight}px`
  node.style.opacity = '1'
}
const onLeave = (raw: Element) => {
  const node = el(raw)
  void node.offsetHeight // force a reflow so the height below animates
  node.style.height = '0px'
  node.style.opacity = '0'
}
</script>

<template>
  <ul class="divide-y divide-ink-200 border-y border-ink-200">
    <li v-for="(item, index) in items" :key="item.question">
      <h3>
        <button
          type="button"
          class="flex w-full items-start justify-between gap-4 py-5 text-left transition hover:text-accent-700"
          :aria-expanded="openIndex === `${index}`"
          :aria-controls="`faq-panel-${index}`"
          @click="toggle(`${index}`)"
        >
          <span class="text-[1.0625rem] font-semibold text-ink-900">{{ item.question }}</span>
          <BaseIcon
            name="chevronDown"
            :size="20"
            class="mt-1 shrink-0 text-ink-400 transition-transform duration-200"
            :class="openIndex === `${index}` && 'rotate-180'"
          />
        </button>
      </h3>

      <Transition
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
      >
        <div
          v-show="openIndex === `${index}`"
          :id="`faq-panel-${index}`"
          class="overflow-hidden transition-[height,opacity] duration-200 ease-out"
        >
          <p class="max-w-3xl pb-6 pr-8 leading-relaxed text-ink-600">{{ item.answer }}</p>
        </div>
      </Transition>
    </li>
  </ul>
</template>
