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
 *
 * THE WORDS LIVE IN  src/content/services.json  — edit that file, not this one.
 * This module only puts types on top of the JSON, so the app keeps its
 * autocomplete and type checking. Keeping the text in JSON is what lets a CMS
 * edit it later without touching any code.
 */

import content from '@/content/services.json'

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

export const packages: ServicePackage[] = content.packages as ServicePackage[]

/* -------------------------------------------------------------------------- */
/* 2. Add-on services                                                          */
/* -------------------------------------------------------------------------- */

export const addOns: AddOnService[] = content.addOns as AddOnService[]

/* -------------------------------------------------------------------------- */
/* 3. Comparison chart data                                                    */
/*                                                                             */
/* NOT CURRENTLY RENDERED. The Compare section was pulled from both the Home   */
/* and Services pages pending a new design. Everything below is kept as-is so  */
/* the section can be restored without rebuilding it — see the comments in     */
/* HomeView.vue and ServicesView.vue for where it used to sit.                 */
/* -------------------------------------------------------------------------- */

export const comparison = content.comparison

/** Convenience: the package names in chart order. */
export const packageNames = packages.map((p) => p.name)

/* -------------------------------------------------------------------------- */
/* 4. Finishes — shown on the home page and offered in the quote form          */
/* -------------------------------------------------------------------------- */

export interface Finish {
  name: string
  /** Swatch gradient for the home page panel. */
  css: string
}

export const finishes: Finish[] = content.finishes as Finish[]

/* -------------------------------------------------------------------------- */
/* 5. Paint condition — the checklist on the quote form                        */
/* -------------------------------------------------------------------------- */

/**
 * What a customer can flag about their paint before we see the vehicle. These
 * are the things that change a quote, because a sprayed coating follows the
 * surface underneath it — so knowing up front saves a wasted walkaround.
 */
export const defectOptions: string[] = content.defectOptions as string[]
