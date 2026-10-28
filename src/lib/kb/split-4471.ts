// #4471 split into the problems it holds, one ticket each (issues in this repo).
// Counted the desk's way: causes.ts places a report by tenant and channel. The desk's one-day moves
// (desk-notes.json) stay counted where they're filed, and are their own problem too.
import notes from '#lib/data/desk-notes.json';
import { causeOf, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'shift';

export const TICKETS_URL = 'https://github.com/dominik-appsilon/mega-s01e03-what-it-shows/issues';

// Status from engineering's update on #4471 (closed 2026-10-05).
export const PROBLEMS: Record<Problem, { ticket: number; what: string; status: string }> = {
  parser: { ticket: 1, what: 'Shared parser reads dates month first for day-first tenants', status: 'fixed' },
  hint: { ticket: 2, what: 'booking-v3 form hint says MM/DD/YYYY for day-first tenants', status: "won't fix: form retired" },
  shift: { ticket: 3, what: 'Booking moves by one day (time zone)', status: 'open' },
};

export function inProblem(p: Problem, r: Report, t: Tenant | undefined): boolean {
  return p === 'shift' ? notes.oneDayMove.includes(r.id) : causeOf(r, t) === p;
}
