/**
 * ---------------------------------------------------------------------------
 * "HOW IT WORKS" STEPS + VALUE PROPS
 * ---------------------------------------------------------------------------
 * Used on the Home and Services pages.
 */

export interface ProcessStep {
  step: string
  title: string
  body: string
}

export const processSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'Quote',
    body: 'Send us your vehicle and the look you want through the form, or call the shop. We give you a real number, not a range pulled out of thin air.',
  },
  {
    step: '02',
    title: 'Walkaround',
    body: 'We inspect the paint together, confirm the color and finish, and flag anything that needs attention before the coating goes on.',
  },
  {
    step: '03',
    title: 'Prep',
    body: 'Wash, decontamination, masking and disassembly. This is the part nobody sees and the part that decides how good the result looks.',
  },
  {
    step: '04',
    title: 'Spray & Cure',
    body: 'Coats are built up in a controlled space, then given time to cure properly before anything is reassembled or handled.',
  },
  {
    step: '05',
    title: 'Handoff',
    body: 'Reassembly, a final inspection under light, and a walkthrough of exactly how to care for the finish going forward.',
  },
]

export interface ValueProp {
  title: string
  body: string
  /** Key into the icon set in components/BaseIcon.vue */
  icon: 'shield' | 'droplet' | 'sparkle' | 'wrench'
}

export const valueProps: ValueProp[] = [
  {
    icon: 'droplet',
    title: 'Seamless coverage',
    body: 'Sprayed, not stretched. Vents, curves and recesses get the same even coverage as flat panels — no seams, no cut lines, no lifting edges.',
  },
  {
    icon: 'shield',
    title: 'Factory paint protected',
    body: 'The coating bonds to the surface, not into it. Your original paint stays sealed away from sun, light scratches and road grime.',
  },
  {
    icon: 'sparkle',
    title: 'Reversible',
    body: 'Change your mind, sell the car, or go back to stock. The finish peels off cleanly and leaves the paint underneath exactly as it was.',
  },
  {
    icon: 'wrench',
    title: 'Repairable',
    body: 'Scuffs and chips get scuffed and re-coated in place. No re-wrapping an entire panel over one bad rock strike.',
  },
]
