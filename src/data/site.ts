/**
 * ---------------------------------------------------------------------------
 * SITE-WIDE BUSINESS INFO
 * ---------------------------------------------------------------------------
 * Everything in this file appears in the header, footer, contact page and
 * structured data. Change it here once and it updates everywhere.
 *
 * THE WORDS LIVE IN  src/content/site.json  — edit that file, not this one.
 * This module only puts types on top of the JSON, so the app keeps its
 * autocomplete and type checking. Keeping the text in JSON is what lets a CMS
 * edit it later without touching any code.
 */

import content from '@/content/site.json'

export interface NavLink {
  label: string
  to: string
}

const address = content.site.address
const addressLine = `${address.street}, ${address.city}, ${address.state} ${address.zip}`

export const site = {
  ...content.site,

  /**
   * Derived, not stored. Both of these have to agree with the phone number and
   * address above, and a stored copy is one edit away from silently pointing
   * somewhere wrong — a dead tel: link or a map of the wrong building.
   */
  phoneHref: `+1${content.site.phone.replace(/\D/g, '')}`,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine)}`,

  /**
   * Not content, so not in the JSON: this is injected at build time so it
   * matches wherever the site is actually deployed — see vite.config.ts.
   */
  url: import.meta.env.VITE_SITE_URL || 'https://fusionautolab.com',
}

export const navLinks: NavLink[] = content.navLinks as NavLink[]

export const fullAddress = addressLine
