<script setup lang="ts">
import CtaBand from '@/components/CtaBand.vue'
import GalleryGrid from '@/components/GalleryGrid.vue'
import PageHero from '@/components/PageHero.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import { useSeo } from '@/composables/useSeo'
import { galleryItems } from '@/data/gallery'
import { site } from '@/data/site'

useSeo({
  title: 'Gallery',
  description:
    'Liquid wrap work from Fusion Auto Lab in Knoxville, TN — full color changes, wheels, chrome deletes and custom trim.',
  path: '/gallery',
})

const hasPhotos = galleryItems.some((item) => item.src)
const instagram = site.socials[0]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Portfolio"
      title="The work"
      subtitle="Full color changes, wheels and trim — shot in the shop before the keys go back."
    />

    <section class="bg-white py-14 sm:py-18 lg:py-20">
      <div class="container-page">
        <!-- Friendly note while the portfolio is being built up -->
        <div
          v-if="!hasPhotos"
          class="mb-10 flex flex-col gap-4 rounded-xl border border-ink-200 bg-ink-50 p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex gap-4">
            <span
              class="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-accent-400 sm:inline-flex"
            >
              <BaseIcon name="image" :size="20" />
            </span>
            <div>
              <p class="font-bold text-ink-900">Fresh photos are on the way</p>
              <p class="mt-1 max-w-xl text-[0.9375rem] leading-relaxed text-ink-600">
                We are building out the portfolio right now. In the meantime, the latest jobs go up
                on Instagram first — and we are happy to walk you through past work in person.
              </p>
            </div>
          </div>
          <a
            v-if="instagram"
            :href="instagram.url"
            target="_blank"
            rel="noopener"
            class="btn btn-dark shrink-0"
          >
            <BaseIcon name="instagram" :size="16" />
            {{ instagram.handle }}
          </a>
        </div>

        <GalleryGrid />
      </div>
    </section>

    <CtaBand
      title="Want your car in the gallery?"
      subtitle="Send us the details and we will get you scheduled."
    />
  </div>
</template>
