<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { galleryCategories, galleryItems, type GalleryCategory, type GalleryItem } from '@/data/gallery'
import BaseIcon from './BaseIcon.vue'

const active = ref<GalleryCategory>('All')

const filtered = computed(() =>
  active.value === 'All' ? galleryItems : galleryItems.filter((i) => i.category === active.value),
)

/** Only categories that actually have entries are worth showing as filters. */
const availableCategories = computed(() =>
  galleryCategories.filter(
    (c) => c === 'All' || galleryItems.some((i) => i.category === c),
  ),
)

/* --- lightbox -------------------------------------------------------------- */
const lightbox = ref<GalleryItem | null>(null)
const open = (item: GalleryItem) => {
  if (item.src) lightbox.value = item
}
const onKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') lightbox.value = null
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div>
    <!-- Filters -->
    <div class="-mx-5 mb-8 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <ul class="flex min-w-max gap-2">
        <li v-for="category in availableCategories" :key="category">
          <button
            type="button"
            class="rounded-full border px-4 py-2 text-sm font-semibold transition"
            :class="
              active === category
                ? 'border-ink-900 bg-ink-900 text-white'
                : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-900'
            "
            @click="active = category"
          >
            {{ category }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Grid -->
    <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="item in filtered"
        :key="item.id"
        :class="item.wide && 'sm:col-span-2 lg:col-span-2'"
      >
        <component
          :is="item.src ? 'button' : 'div'"
          :type="item.src ? 'button' : undefined"
          class="group relative block h-full w-full overflow-hidden rounded-xl border border-ink-200 bg-ink-50 text-left"
          @click="open(item)"
        >
          <div class="aspect-[4/3] w-full overflow-hidden">
            <img
              v-if="item.src"
              :src="item.src"
              :alt="item.alt ?? `${item.title} — ${item.detail}`"
              loading="lazy"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <!-- Placeholder tile: keeps the layout intentional until photos land -->
            <div
              v-else
              class="flex h-full w-full flex-col items-center justify-center gap-2 bg-ink-100/70 text-ink-400"
              style="
                background-image: repeating-linear-gradient(
                  135deg,
                  transparent,
                  transparent 10px,
                  rgb(16 19 21 / 0.025) 10px,
                  rgb(16 19 21 / 0.025) 20px
                );
              "
            >
              <BaseIcon name="image" :size="26" />
              <span class="text-xs font-semibold uppercase tracking-wider">Photo coming soon</span>
            </div>
          </div>

          <div class="border-t border-ink-200 bg-white p-4">
            <p class="text-[0.9375rem] font-bold text-ink-900">{{ item.title }}</p>
            <p class="mt-0.5 text-sm text-ink-500">{{ item.detail }}</p>
          </div>
        </component>
      </li>
    </ul>

    <!-- Lightbox -->
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div
        v-if="lightbox"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/90 p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="lightbox.title"
        @click="lightbox = null"
      >
        <button
          type="button"
          class="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/25 text-white transition hover:bg-white/10"
          aria-label="Close image"
          @click="lightbox = null"
        >
          <BaseIcon name="close" :size="22" />
        </button>
        <figure class="max-h-full max-w-4xl" @click.stop>
          <img
            :src="lightbox.src!"
            :alt="lightbox.alt ?? lightbox.title"
            class="max-h-[80vh] w-auto rounded-lg object-contain"
          />
          <figcaption class="mt-3 text-center text-sm text-ink-300">
            <span class="font-semibold text-white">{{ lightbox.title }}</span>
            — {{ lightbox.detail }}
          </figcaption>
        </figure>
      </div>
    </Transition>
  </div>
</template>
