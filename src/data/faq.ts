/**
 * ---------------------------------------------------------------------------
 * FAQ
 * ---------------------------------------------------------------------------
 * Add, remove or reword freely. Anything here is also fed to Google as FAQ
 * structured data, so keep answers accurate and in your own voice.
 *
 * THE WORDS LIVE IN  src/content/faq.json  — edit that file, not this one.
 * This module only puts types on top of the JSON, so the app keeps its
 * autocomplete and type checking. Keeping the text in JSON is what lets a CMS
 * edit it later without touching any code.
 */

import content from '@/content/faq.json'

export interface FaqItem {
  question: string
  answer: string
  /** Groups questions into sections on the FAQ page. */
  category: 'The Basics' | 'Care & Longevity' | 'Booking & Pricing'
}

export const faqs: FaqItem[] = content.faqs as FaqItem[]
