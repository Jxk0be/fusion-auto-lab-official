<script setup lang="ts">
import { computed, ref } from 'vue'
import type { UploadedPhoto } from '@/types'
import BaseIcon from './BaseIcon.vue'

/**
 * Photo picker for the quote form.
 *
 * Photos are sent inside the JSON body as data URLs and become email
 * attachments, which means the whole submission has to stay under the
 * serverless function's request limit. A phone camera shot is 3–8 MB and
 * base64 adds about a third on top, so two untouched photos would blow it.
 *
 * Every image is therefore redrawn through a canvas at a sane size before it
 * ever leaves the browser. A defect photo only needs to show the defect: 1600px
 * is plenty for rust, a dent or lifting clear coat, and it turns an 8 MB
 * original into roughly 300 KB. That also means the upload finishes quickly on
 * shop wifi or a phone signal.
 */

const props = withDefaults(
  defineProps<{
    modelValue: UploadedPhoto[]
    maxFiles?: number
  }>(),
  { maxFiles: 6 },
)

const emit = defineEmits<{ 'update:modelValue': [UploadedPhoto[]] }>()

const MAX_DIMENSION = 1600
const QUALITY = 0.72
/** Keeps the encoded payload comfortably inside the function's body limit. */
const MAX_TOTAL_BYTES = 3.5 * 1024 * 1024

const input = ref<HTMLInputElement | null>(null)
const busy = ref(false)
const notice = ref('')

const totalBytes = computed(() => props.modelValue.reduce((sum, p) => sum + p.bytes, 0))
const readableTotal = computed(() => `${(totalBytes.value / 1024 / 1024).toFixed(1)} MB`)

/** Redraws the image at a bounded size and returns it as a JPEG data URL. */
const shrink = async (file: File): Promise<UploadedPhoto> => {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const dataUrl = canvas.toDataURL('image/jpeg', QUALITY)
  // Rough decoded size of the base64 payload.
  const bytes = Math.round((dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75)
  return { name: file.name.replace(/\.[^.]+$/, '') + '.jpg', dataUrl, bytes }
}

const onPick = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const chosen = Array.from(target.files ?? [])
  target.value = '' // so picking the same file twice still fires change
  if (!chosen.length) return

  notice.value = ''
  busy.value = true

  const next = [...props.modelValue]
  const skipped: string[] = []

  for (const file of chosen) {
    if (next.length >= props.maxFiles) {
      skipped.push(`${file.name} (limit is ${props.maxFiles} photos)`)
      continue
    }
    if (!file.type.startsWith('image/')) {
      skipped.push(`${file.name} (not an image)`)
      continue
    }
    try {
      const photo = await shrink(file)
      const runningTotal = next.reduce((sum, p) => sum + p.bytes, 0)
      if (runningTotal + photo.bytes > MAX_TOTAL_BYTES) {
        skipped.push(`${file.name} (would exceed the size limit)`)
        continue
      }
      next.push(photo)
    } catch {
      // HEIC and a few other formats can't be decoded by every browser.
      skipped.push(`${file.name} (couldn't be read — try a JPG or PNG)`)
    }
  }

  emit('update:modelValue', next)
  busy.value = false
  if (skipped.length) notice.value = `Skipped: ${skipped.join(', ')}`
}

const remove = (index: number) => {
  const next = [...props.modelValue]
  next.splice(index, 1)
  emit('update:modelValue', next)
  notice.value = ''
}
</script>

<template>
  <div>
    <input
      ref="input"
      type="file"
      accept="image/*"
      multiple
      class="sr-only"
      @change="onPick"
    />

    <button
      type="button"
      class="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-ink-300 bg-ink-50 px-4 py-7 text-center transition hover:border-ink-400 hover:bg-ink-100 disabled:opacity-60"
      :disabled="busy || modelValue.length >= maxFiles"
      @click="input?.click()"
    >
      <BaseIcon :name="busy ? 'spinner' : 'image'" :size="22" :class="['text-ink-400', busy && 'animate-spin']" />
      <span class="text-[0.9375rem] font-semibold text-ink-800">
        {{
          busy
            ? 'Preparing photos…'
            : modelValue.length >= maxFiles
              ? `Maximum of ${maxFiles} photos added`
              : 'Add photos'
        }}
      </span>
      <span class="text-[0.8125rem] text-ink-500">
        Up to {{ maxFiles }} — they're resized in your browser, so large files are fine
      </span>
    </button>

    <p v-if="notice" class="mt-2 text-[0.8125rem] text-amber-700">{{ notice }}</p>

    <ul v-if="modelValue.length" class="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
      <li v-for="(photo, index) in modelValue" :key="photo.dataUrl.slice(-24)" class="relative">
        <img
          :src="photo.dataUrl"
          :alt="`Attached photo ${index + 1}`"
          class="aspect-square w-full rounded-lg border border-ink-200 object-cover"
        />
        <button
          type="button"
          class="absolute -right-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 shadow-card transition hover:border-red-300 hover:text-red-600"
          :aria-label="`Remove photo ${index + 1}`"
          @click="remove(index)"
        >
          <BaseIcon name="close" :size="14" />
        </button>
      </li>
    </ul>

    <p v-if="modelValue.length" class="mt-2 text-[0.8125rem] text-ink-400">
      {{ modelValue.length }} of {{ maxFiles }} · {{ readableTotal }}
    </p>
  </div>
</template>
