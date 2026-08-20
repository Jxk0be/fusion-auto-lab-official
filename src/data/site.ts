/**
 * ---------------------------------------------------------------------------
 * SITE-WIDE BUSINESS INFO
 * ---------------------------------------------------------------------------
 * Everything in this file appears in the header, footer, contact page and
 * structured data. Change it here once and it updates everywhere.
 */

export interface NavLink {
  label: string
  to: string
}

export const site = {
  name: 'Fusion Auto Lab',
  shortName: 'Fusion Auto Lab',
  tagline: 'Automotive Liquid Wrapping',
  /** One-line pitch used in the hero and meta descriptions. */
  blurb:
    'Sprayed-on, fully removable color changes for your vehicle — finished by hand, built to last, and reversible whenever you want the factory paint back.',

  phone: '(865) 320-1200',
  /** Digits only — used for tel: links. */
  phoneHref: '+18653201200',
  email: 'fusionautolab@gmail.com',

  address: {
    street: '3009 N Central St',
    city: 'Knoxville',
    state: 'TN',
    zip: '37917',
  },
  /** Opens the address in the visitor's default maps app. */
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=3009+N+Central+St+Knoxville+TN+37917',

  /** Shown in the header, footer and on the contact page. */
  hours: '10:00 AM – 7:00 PM',
  hoursDetail: [
    { days: 'Monday – Friday', time: '10:00 AM – 7:00 PM' },
    { days: 'Saturday', time: '10:00 AM – 7:00 PM' },
    { days: 'Sunday', time: '10:00 AM – 7:00 PM' },
  ],

  socials: [
    { label: 'Instagram', handle: '@fusionautolab', url: 'https://www.instagram.com/fusionautolab' },
  ],

  /**
   * Payment link. Set `enabled: false` to hide the Payments page and every
   * "Make a Payment" button across the site until you're ready.
   */
  payment: {
    enabled: true,
    label: 'Venmo',
    url: 'https://venmo.com/code?user_id=3216574508957696717&created=1768707927',
  },

  /** Used for canonical URLs and the sitemap. */
  url: 'https://fusionautolab.com',
} as const

export const navLinks: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
]

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`
