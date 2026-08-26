/**
 * ---------------------------------------------------------------------------
 * CUSTOMER REVIEWS
 * ---------------------------------------------------------------------------
 * This list starts empty on purpose — the Reviews page shows a clean
 * "reviews coming soon" state until you add real ones. Never add a review you
 * did not actually receive; fake reviews are the fastest way to lose trust
 * (and they violate Google and Meta policy).
 *
 * To add one, copy the example below into the array:
 *
 *   {
 *     name: 'First name L.',
 *     vehicle: '2019 Mustang GT',
 *     service: 'Signature — satin black',
 *     quote: 'Exactly what I asked for. The finish is flawless.',
 *     rating: 5,
 *     source: 'Google',
 *   },
 *
 * THE WORDS LIVE IN  src/content/testimonials.json  — edit that file, not this one.
 * This module only puts types on top of the JSON, so the app keeps its
 * autocomplete and type checking. Keeping the text in JSON is what lets a CMS
 * edit it later without touching any code.
 */

import content from '@/content/testimonials.json'

export interface Testimonial {
  name: string
  vehicle?: string
  service?: string
  quote: string
  /** 1–5. Omit to hide the stars for that review. */
  rating?: number
  /** e.g. 'Google', 'Instagram', 'In person' */
  source?: string
}

export const testimonials: Testimonial[] = content.testimonials as Testimonial[]
