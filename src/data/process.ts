/**
 * ---------------------------------------------------------------------------
 * "HOW IT WORKS" STEPS + VALUE PROPS
 * ---------------------------------------------------------------------------
 * Used on the Home and Services pages.
 *
 * THE WORDS LIVE IN  src/content/process.json  — edit that file, not this one.
 * This module only puts types on top of the JSON, so the app keeps its
 * autocomplete and type checking. Keeping the text in JSON is what lets a CMS
 * edit it later without touching any code.
 */

import content from '@/content/process.json'

export interface ProcessStep {
  step: string
  title: string
  body: string
}

export const processSteps: ProcessStep[] = content.processSteps as ProcessStep[]

export interface ValueProp {
  title: string
  body: string
  /** Key into the icon set in components/BaseIcon.vue */
  icon: 'shield' | 'droplet' | 'sparkle' | 'tag'
}

export const valueProps: ValueProp[] = content.valueProps as ValueProp[]
