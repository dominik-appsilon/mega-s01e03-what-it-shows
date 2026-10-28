// #4471 split into the problems it holds, one ticket each (issues in this repo).
// causes.ts places a report by tenant and channel; the desk's one-day moves (desk-notes.json) are
// their own problem, so they are taken out before that.
import notes from '#lib/data/desk-notes.json';
import { causeOf, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'shift' | 'unplaced';

export const TICKETS_URL = 'https://github.com/dominik-appsilon/mega-s01e03-what-it-shows/issues';

export const PROBLEMS: Record<Exclude<Problem, 'unplaced'>, { ticket: number; what: string }> = {
  parser: { ticket: 1, what: 'Shared parser reads dates month first for day-first tenants' },
  hint: { ticket: 2, what: 'booking-v3 form hint says MM/DD/YYYY for day-first tenants' },
  shift: { ticket: 3, what: 'Booking moves by one day (time zone)' },
};

export function problemOf(r: Report, t: Tenant | undefined): Problem {
  if (notes.oneDayMove.includes(r.id)) return 'shift';
  return causeOf(r, t) ?? 'unplaced';
}
