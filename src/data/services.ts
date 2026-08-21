/**
 * ---------------------------------------------------------------------------
 * SERVICES, PRICING AND THE COMPARISON CHART
 * ---------------------------------------------------------------------------
 * This is the file to edit as the business grows. Three things live here:
 *
 *   1. `packages`   — the tiered wrap packages shown on Home + Services
 *   2. `addOns`     — the a-la-carte jobs listed under the packages
 *   3. `comparison` — the traits + scores that drive the radar chart and the
 *                     side-by-side table on the Services page
 *
 * Adding a package: copy a block, give it a new `id`, and add a matching score
 * array to every trait in `comparison.traits` (same order as `packages`).
 */

export interface ServicePackage {
  id: string
  name: string
  /** Short line under the name. */
  summary: string
  /**
   * Set to a string like '$1,200' to show a starting price, or leave as null
   * to show "Request a quote" instead. Prices vary by vehicle size, so most
   * shops leave this null until they have a firm number.
   */
  priceFrom: string | null
  /** Small note under the price, e.g. 'Sedans and coupes'. */
  priceNote?: string
  /** Rough shop time, shown as a badge. */
  turnaround: string
  features: string[]
  /** Highlights one card as the recommended option. Only mark one. */
  featured?: boolean
}

export interface AddOnService {
  id: string
  name: string
  description: string
  priceFrom: string | null
}

export interface ComparisonTrait {
  label: string
  /** Plain-English explanation shown in the table and on hover. */
  description: string
  /**
   * One score (1–10) per package, in the SAME ORDER as `packages` above.
   * These drive the radar chart, so keep the arrays the same length.
   */
  scores: number[]
}

/* -------------------------------------------------------------------------- */
/* 1. Wrap packages                                                            */
/* -------------------------------------------------------------------------- */

export const packages: ServicePackage[] = [
  {
    id: 'essential',
    name: 'Essential',
    summary: 'A clean, single-color change in a solid gloss, satin or matte finish.',
    priceFrom: null,
    priceNote: 'Priced by vehicle size, condition, and finish',
    turnaround: 'Approximately 2–4 days',
    features: [
      'Full exterior color change in one solid color',
      'Wash, decontamination and full masking',
      'Door jambs masked to a clean edge',
      'Gloss, satin or matte finish',
      'Peels off cleanly when you want the original paint back',
      'Post-cure inspection and a walkthrough before handoff',
    ],
  },
  {
    id: 'signature',
    name: 'Signature',
    summary: 'Metallic, chrome, pearl, and color shift base coats with paint-like quality and feel.',
    priceFrom: null,
    priceNote: 'Most full-vehicle jobs land here',
    turnaround: 'Approximately 3–5 days',
    featured: true,
    features: [
      'Everything in Essential',
      'Metallic, chrome, pearl or color-shift base coats',
      'Additional coats for a deeper, more durable finish',
      'Paint-like protective top coat that can be buffed, polished, and ceramic coated',
    ],
  },
  {
    id: 'custom',
    name: 'Custom',
    summary: 'Custom multi-tone or multi-finish, designs, and fade work with show-level finishing.',
    priceFrom: null,
    priceNote: 'Quoted per project after a walkaround',
    turnaround: 'Approximately 1–3 weeks',
    features: [
      'Everything in Signature',
      'Custom hand crafted liquid wrap job with options for multi-tone, multi-finish, designs, themes, and color fades',
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* 2. Add-on services                                                          */
/* -------------------------------------------------------------------------- */

export const addOns: AddOnService[] = [
  {
    id: 'wheels',
    name: 'Wheels',
    description: 'All four wheels wrapped in gloss, satin or matte color — a fast way to change the whole look of the car.',
    priceFrom: null,
  },
  {
    id: 'chrome-delete',
    name: 'Chrome Delete',
    description: 'Window trim, grille surrounds and badges blacked out for a cleaner, modern look.',
    priceFrom: null,
  },
  {
    id: 'accents',
    name: 'Trim & Accents',
    description: 'Mirror caps, roof, spoiler, grille or badges done in a contrasting color.',
    priceFrom: null,
  },
  {
    id: 'roof',
    name: 'Roof & Hood',
    description: 'Two-tone roof, hood or hardtop treatment without committing to a full color change.',
    priceFrom: null,
  },
  {
    id: 'removal',
    name: 'Removal & Refresh',
    description: 'Peel and clean-up of an existing wrap, or a refresh coat to bring the finish back.',
    priceFrom: null,
  },
]

/* -------------------------------------------------------------------------- */
/* 3. Comparison chart data                                                    */
/* -------------------------------------------------------------------------- */

export const comparison = {
  /** Scores are 1–10. Order must match `packages` above. */
  traits: <ComparisonTrait[]>[
    {
      label: 'Durability',
      description: 'How well the finish holds up to weather, washing and daily driving over the years.',
      scores: [6, 8, 10],
    },
    {
      label: 'Finish Depth',
      description: 'Gloss level, clarity and how much depth the color has under direct light.',
      scores: [6, 8, 10],
    },
    {
      label: 'Color Range',
      description: 'How many finish options are on the table — solids only, or metallics, candies and fades.',
      scores: [5, 8, 10],
    },
    {
      label: 'Chip & UV Resistance',
      description: 'Resistance to rock chips, road debris and fading from sun exposure.',
      scores: [6, 8, 9],
    },
    {
      label: 'Turnaround Speed',
      description: 'How quickly the vehicle is back in your hands. More layers and prep means more shop time.',
      scores: [9, 7, 4],
    },
    {
      label: 'Clean Removal',
      description: 'How easily the coating peels back off down the road, leaving the factory paint untouched.',
      scores: [9, 8, 7],
    },
  ],
} as const

/** Convenience: the package names in chart order. */
export const packageNames = packages.map((p) => p.name)
