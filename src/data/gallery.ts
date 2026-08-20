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
 */

export interface GalleryItem {
  id: string
  title: string
  /** Short description of the work — shown under the title. */
  detail: string
  /** Filter chip this belongs to. */
  category: 'Full Wraps' | 'Wheels & Calipers' | 'Trim & Accents'
  /** Path under /public, or null for a placeholder tile. */
  src: string | null
  /** Describe the image for screen readers and search engines. */
  alt?: string
  /** Set true to make the tile span two columns on desktop. */
  wide?: boolean
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'full-1',
    title: 'Full Color Change',
    detail: 'Gloss solid, door jambs masked',
    category: 'Full Wraps',
    src: null,
    wide: true,
  },
  {
    id: 'wheels-1',
    title: 'Wheel Set',
    detail: 'Four wheels, satin finish',
    category: 'Wheels & Calipers',
    src: null,
  },
  {
    id: 'trim-1',
    title: 'Chrome Delete',
    detail: 'Window trim and grille surround',
    category: 'Trim & Accents',
    src: null,
  },
  {
    id: 'full-2',
    title: 'Metallic Finish',
    detail: 'Pearl base with gloss top coat',
    category: 'Full Wraps',
    src: null,
  },
  {
    id: 'calipers-1',
    title: 'Brake Calipers',
    detail: 'High-temp color, masked on the vehicle',
    category: 'Wheels & Calipers',
    src: null,
  },
  {
    id: 'full-3',
    title: 'Two-Tone Layout',
    detail: 'Contrast roof and mirror caps',
    category: 'Full Wraps',
    src: null,
    wide: true,
  },
]

export const galleryCategories = ['All', 'Full Wraps', 'Wheels & Calipers', 'Trim & Accents'] as const
export type GalleryCategory = (typeof galleryCategories)[number]
