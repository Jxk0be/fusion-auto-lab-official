/**
 * ---------------------------------------------------------------------------
 * GALLERY / PORTFOLIO
 * ---------------------------------------------------------------------------
 * HOW TO ADD A PHOTO
 *   1. Drop the image into  public/gallery/   (e.g. public/gallery/mustang.jpg)
 *   2. Set  src: '/gallery/mustang.jpg'  on the matching entry below
 *
 * Any entry with `src: null` renders as a tidy "photo coming soon" tile, so
 * the page still looks intentional while the portfolio is being built up.
 *
 * Image tips: shoot landscape, 1600px wide is plenty, and keep files under
 * ~400KB (squoosh.app is a free one-click compressor) so the page stays fast.
 *
 * THE WORDS LIVE IN  src/content/gallery.json  — edit that file, not this one.
 * This module only puts types on top of the JSON, so the app keeps its
 * autocomplete and type checking. Keeping the text in JSON is what lets a CMS
 * edit it later without touching any code.
 */

import content from '@/content/gallery.json'

export interface GalleryItem {
  id: string
  title: string
  /** Short description of the work — shown under the title. */
  detail: string
  /** Filter chip this belongs to. */
  category: 'Full Wraps' | 'Wheels' | 'Trim & Accents'
  /** Path under /public, or null for a placeholder tile. */
  src: string | null
  /** Describe the image for screen readers and search engines. */
  alt?: string
  /** Set true to make the tile span two columns on desktop. */
  wide?: boolean
}

export const galleryItems: GalleryItem[] = content.galleryItems as GalleryItem[]

export const galleryCategories = ['All', 'Full Wraps', 'Wheels', 'Trim & Accents'] as const
export type GalleryCategory = (typeof galleryCategories)[number]
