/**
 * ---------------------------------------------------------------------------
 * WHAT THE EDITOR SHOWS
 * ---------------------------------------------------------------------------
 * The editor at /admin renders whatever is in the content JSON, so new fields
 * appear on their own. This file is only about presentation: friendly names,
 * help text, which controls to use, and which technical values to keep out of
 * a non-technical person's way.
 *
 * Hiding a key here does NOT delete it — it is saved back untouched.
 */

export interface ContentFile {
  file: string
  title: string
  blurb: string
}

/** Order here is the order of the tabs in the editor. */
export const CONTENT_FILES: ContentFile[] = [
  {
    file: 'src/content/site.json',
    title: 'Contact & Hours',
    blurb: 'Phone, email, address and opening hours. These show in the header, footer and on the contact page.',
  },
  {
    file: 'src/content/services.json',
    title: 'Wrap Services',
    blurb: 'Your wrap packages, what each includes, prices, and the smaller a-la-carte jobs.',
  },
  {
    file: 'src/content/mechanic.json',
    title: 'Mechanic Work',
    blurb: 'Hourly rate, the jobs you take on, and the referral offer.',
  },
  {
    file: 'src/content/faq.json',
    title: 'FAQ',
    blurb: 'Questions and answers. These also feed Google, so plain, accurate answers work best.',
  },
  {
    file: 'src/content/gallery.json',
    title: 'Gallery',
    blurb: 'Your portfolio. Photo files still need uploading to the site — ask about adding one if the box is empty.',
  },
  {
    file: 'src/content/testimonials.json',
    title: 'Reviews',
    blurb: 'Customer reviews. Only add real ones you actually received.',
  },
  {
    file: 'src/content/process.json',
    title: 'How It Works',
    blurb: 'The step-by-step on the home page, and the four "why liquid wrap" points.',
  },
]

/**
 * Technical values the owner has no reason to touch. Slugs are referenced by
 * code, icon names must match an existing icon, gradients are CSS, and the
 * comparison scores drive a chart that no page currently shows.
 */
export const HIDDEN_KEYS = new Set([
  'id',
  'icon',
  'css',
  'comparison',
  'scores',
  'alt',
])

/** Keys that deserve a textarea rather than a single-line input. */
export const LONG_TEXT_KEYS = new Set([
  'answer',
  'body',
  'blurb',
  'description',
  'summary',
  'quote',
  'detail',
  'rateComparison',
  'headline',
])

/** Friendlier names than the raw JSON keys. */
export const LABELS: Record<string, string> = {
  addOns: 'Smaller jobs',
  address: 'Address',
  blurb: 'Short description',
  category: 'Section',
  defectOptions: 'Paint condition checklist',
  detail: 'Caption',
  enabled: 'Show this on the site',
  faqs: 'Questions',
  features: "What's included",
  finishes: 'Finishes offered',
  galleryItems: 'Gallery items',
  handle: 'Username',
  hours: 'Hours',
  hoursDetail: 'Hours, day by day',
  hoursShort: 'Hours (short version)',
  hourlyRate: 'Hourly rate',
  jobs: 'Jobs you take on',
  mechanic: 'Mechanic work',
  name: 'Name',
  navLinks: 'Menu links',
  payment: 'Payment link',
  percent: 'Referral percentage',
  packages: 'Wrap packages',
  priceFrom: 'Starting price',
  priceNote: 'Note under the price',
  processSteps: 'Steps',
  promises: 'What you promise customers',
  rateComparison: 'Line under the rate',
  rateUnit: 'Rate unit',
  referral: 'Referral offer',
  site: 'Business details',
  socials: 'Social links',
  src: 'Photo file',
  step: 'Step number',
  summary: 'Short description',
  testimonials: 'Reviews',
  title: 'Title',
  turnaround: 'Time in the shop',
  valueProps: 'Why liquid wrap',
  vehicle: 'Vehicle',
  zip: 'ZIP',
}

/** Extra guidance shown under a field. */
export const HELP: Record<string, string> = {
  priceFrom: 'Leave empty to show "Request a quote" instead of a number.',
  featured: 'Marks this as the recommended package. Only tick one.',
  src: 'Path to an uploaded photo, like /gallery/mustang.jpg. Leave empty to show a "photo coming soon" tile.',
  hoursShort: 'The compact version shown in the header, e.g. Mon–Fri, 10 AM – 6 PM.',
  rateComparison: 'A comparison claim — make sure it is one you can stand behind.',
  rating: 'A number from 1 to 5.',
  enabled: 'Untick to hide the payment page and every payment button.',
}

export const labelFor = (key: string): string =>
  LABELS[key] ??
  key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase())
