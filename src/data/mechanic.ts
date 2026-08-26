/**
 * ---------------------------------------------------------------------------
 * MECHANIC WORK
 * ---------------------------------------------------------------------------
 * The job types offered in the quote form when someone picks mechanic work.
 * Edit freely — the form reads this list directly.
 *
 * Deliberately broad: the shop does not have the equipment for every job on
 * every vehicle, so the form says as much and asks them to describe it. The
 * point of the list is to save typing, not to promise anything.
 */

export const mechanicJobs: string[] = [
  'Brakes',
  'Suspension & steering',
  'Starting & charging (battery, starter, alternator)',
  'Cooling system / overheating',
  'Belts, hoses & leaks',
  'Routine maintenance (oil, fluids, plugs)',
  'Check-engine light / diagnosis',
  'Exhaust',
  'Something else — described below',
]
