/**
 * ---------------------------------------------------------------------------
 * AUTO MECHANIC SERVICES
 * ---------------------------------------------------------------------------
 * The general repair side of the business — separate from liquid wrapping.
 * Straight hourly labor, no package tiers.
 *
 * THE WORDS LIVE IN  src/content/mechanic.json  — edit that file, not this one.
 * This module only puts types on top of the JSON, so the app keeps its
 * autocomplete and type checking. Keeping the text in JSON is what lets a CMS
 * edit it later without touching any code.
 */

import content from '@/content/mechanic.json'

export interface JobCategory {
  name: string
  description: string
}

export const mechanic = content.mechanic

/**
 * The same jobs as a flat list of names, for the quote form's select. Derived
 * rather than duplicated, so the page and the form can never drift apart.
 */
export const mechanicJobs: string[] = [
  ...mechanic.jobs.map((job) => job.name),
  'Something else',
]
