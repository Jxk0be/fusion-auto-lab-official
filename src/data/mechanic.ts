/**
 * ---------------------------------------------------------------------------
 * AUTO MECHANIC SERVICES
 * ---------------------------------------------------------------------------
 * The general repair side of the business — separate from liquid wrapping.
 * Straight hourly labor, no package tiers.
 */

export interface JobCategory {
  name: string
  description: string
}

export const mechanic = {
  /** Flat labor rate. Change here and it updates the whole page. */
  hourlyRate: '$60',
  rateUnit: 'per hour',

  /**
   * COMPARATIVE CLAIM — worth a sanity check before this goes live.
   * Published labor rates vary a lot: national averages for independent shops
   * run well above this, but rates quoted around East Tennessee sit lower than
   * the national figure. Call two or three local shops, ask their hourly labor
   * rate, and adjust the wording if "about half" is not what you find.
   * Set to null to hide the line entirely.
   */
  rateComparison: 'About half of what most shops around Knoxville charge for labor.',

  /** Referral program, exactly as described: 10% of the labor. */
  referral: {
    percent: '10%',
    headline: 'Bring me work, take 10% of the labor',
    body:
      'If you send someone my way and the job goes through, 10% of the labor on that job is yours. Not the parts — the labor. Paid once the customer settles up. It works for anyone: other shops, detailers, tow drivers, or a neighbor who told a neighbor.',
  },

  /**
   * EDIT THIS LIST. These are the categories people most often call about.
   * The page says plainly that the list is a starting point and that some jobs
   * need equipment that is not in the shop — so nothing here is a promise.
   * Trim anything you would rather not take on.
   */
  jobs: <JobCategory[]>[
    {
      name: 'Brakes',
      description: 'Pads, rotors, calipers, lines and fluid. One of the most common calls.',
    },
    {
      name: 'Suspension & steering',
      description: 'Struts, shocks, control arms, ball joints, tie rods, bushings and wheel bearings.',
    },
    {
      name: 'Starting & charging',
      description: 'Batteries, starters, alternators, and tracking down what is draining the battery.',
    },
    {
      name: 'Cooling system',
      description: 'Radiators, water pumps, thermostats, hoses and overheating problems.',
    },
    {
      name: 'Belts, hoses & leaks',
      description: 'Serpentine belts, tensioners, and finding where the fluid is actually coming from.',
    },
    {
      name: 'Routine maintenance',
      description: 'Oil and filter changes, fluid services, plugs, and general upkeep.',
    },
    {
      name: 'Check-engine diagnosis',
      description: 'Pulling codes is the easy part. Working out what the code is actually telling you is the job.',
    },
    {
      name: 'Exhaust',
      description: 'Leaks, hangers, mid-pipe and muffler work.',
    },
  ],

  /**
   * The three things worth saying about how the shop operates, in the owner's
   * own terms: call first, straight hourly, honest work.
   */
  promises: [
    {
      icon: 'phone' as const,
      title: 'Call before you haul it over',
      body:
        'I do not have the equipment for every job on every vehicle. Call during business hours, tell me what is going on, and I will tell you straight away whether it is something I can take on — or point you somewhere that can. That is a two-minute call that saves you an afternoon.',
    },
    {
      icon: 'clock' as const,
      title: 'One rate, no games',
      body:
        'Labor is one flat hourly rate. No diagnostic tier, no shop-supply percentage tacked on at the end, no different number because of what you drive. You pay for the time the job actually takes.',
    },
    {
      icon: 'shield' as const,
      title: 'Honest and fair, every time',
      body:
        'If a repair is not worth doing, I will say so. If I get into it and it turns out to be less work than quoted, the bill reflects that. If something is beyond what I can do properly, I will tell you rather than guess at it. That matters more to me than any single job.',
    },
  ],
} as const

/**
 * The same jobs as a flat list of names, for the quote form's select. Derived
 * rather than duplicated, so the page and the form can never drift apart.
 */
export const mechanicJobs: string[] = [
  ...mechanic.jobs.map((job) => job.name),
  'Something else',
]
