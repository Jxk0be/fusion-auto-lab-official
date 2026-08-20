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
    priceNote: 'Priced by vehicle size and condition',
    turnaround: '2–3 days',
    features: [
      'Full exterior color change in one solid color',
      'Wash, decontamination and full masking',
      'Door jambs masked to a clean edge',
      'Gloss, satin or matte finish',
      'Peels off cleanly when you want the original paint back',
    ],
  },
  {
    id: 'signature',
    name: 'Signature',
    summary: 'Metallic, pearl and color-shift finishes with extra coats and deeper prep.',
    priceFrom: null,
    priceNote: 'Most full-vehicle jobs land here',
    turnaround: '3–5 days',
    featured: true,
    features: [
      'Everything in Essential',
      'Metallic, pearl or color-shift base coats',
      'Additional build coats for a deeper, wetter finish',
      'Emblems and trim removed or wrapped for cleaner lines',
      'High-gloss protective top coat',
      'Wheels wrapped in a matching or contrasting color',
    ],
  },
  {
    id: 'concours',
    name: 'Concours',
    summary: 'Custom multi-tone, candy and fade work with show-level prep and finishing.',
    priceFrom: null,
    priceNote: 'Quoted per project after a walkaround',
    turnaround: '1–2 weeks',
    features: [
      'Everything in Signature',
      'Custom multi-tone, candy, fade or two-tone layouts',
      'Extended disassembly for paint-like edges and coverage',
      'Panel-by-panel color matching and blend work',
      'Ceramic-grade top coat for gloss retention and easy cleaning',
      'Post-cure inspection and a walkthrough before handoff',
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
    description: 'All four wheels wrapped in gloss, satin or matte — a fast way to change the whole stance of the car.',
    priceFrom: null,
  },
  {
    id: 'calipers',
    name: 'Brake Calipers',
    description: 'High-temp coating in the color of your choice, masked and finished on the vehicle.',
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
