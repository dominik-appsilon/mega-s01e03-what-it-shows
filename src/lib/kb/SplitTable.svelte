<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { PROBLEMS, TICKETS_URL, inProblem, type Problem } from '#lib/kb/split-4471';

  let { ticket }: { ticket: number } = $props();

  const rows = $derived(reports as Report[]);
  const merged = $derived(uniqueById(rows).filter((r) => r.mergedInto === ticket));
  const groups = $derived(
    (Object.keys(PROBLEMS) as Problem[]).map((problem) => {
      const rs = merged.filter((r) => inProblem(problem, r, tenantOf(r)));
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return { problem, n: rs.length, tenants: new Set(rs.map((r) => r.tenant)).size, first: days[0], last: days[days.length - 1] };
    }),
  );
  const moved = $derived(merged.filter((r) => notes.oneDayMove.includes(r.id)).length);
</script>

<p class="sum">
  <strong>{rows.length}</strong> rows in the export · <strong>{merged.length}</strong> unique reports merged into #{ticket} ·
  <strong>{groups.length}</strong> problems
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th><th>status</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.problem)}
      <tr class:open={PROBLEMS[g.problem].status === 'open'}>
        <td>{PROBLEMS[g.problem].what} <code>{g.problem}</code></td>
        <td>{g.n}</td>
        <td>{g.tenants}</td>
        <td>{g.first} → {g.last}</td>
        <td><a href="{TICKETS_URL}/{PROBLEMS[g.problem].ticket}">#{PROBLEMS[g.problem].ticket}</a></td>
        <td>{PROBLEMS[g.problem].status}</td>
      </tr>
    {/each}
  </tbody>
</table>

<p class="note">
  The {moved} <code>shift</code> reports are also counted under <code>parser</code>, where the desk files them by tenant.
</p>

<style>
  .sum { font-size: 1.1rem; }
  .note { color: var(--muted); font-size: 0.85em; }
  .open td { background: var(--warn-bg); }
  .open td:last-child { color: var(--warn); font-weight: 600; }
</style>
