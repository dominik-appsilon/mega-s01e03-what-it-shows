<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { PROBLEMS, TICKETS_URL, problemOf, type Problem } from '#lib/kb/split-4471';

  let { ticket }: { ticket: number } = $props();

  const rows = $derived(reports as Report[]);
  const merged = $derived(uniqueById(rows).filter((r) => r.mergedInto === ticket));
  const groups = $derived.by(() => {
    const by = new Map<Problem, Report[]>();
    for (const r of merged) {
      const p = problemOf(r, tenantOf(r));
      by.set(p, [...(by.get(p) ?? []), r]);
    }
    return [...by.entries()]
      .map(([problem, rs]) => {
        const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
        return { problem, n: rs.length, tenants: new Set(rs.map((r) => r.tenant)).size, first: days[0], last: days[days.length - 1] };
      })
      .sort((a, b) => b.n - a.n);
  });
</script>

<p class="sum">
  <strong>{rows.length}</strong> rows in the export · <strong>{merged.length}</strong> unique reports merged into #{ticket} ·
  <strong>{groups.length}</strong> problems
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.problem)}
      <tr>
        <td>{g.problem === 'unplaced' ? 'no tenant on file' : PROBLEMS[g.problem].what} <code>{g.problem}</code></td>
        <td>{g.n}</td>
        <td>{g.tenants}</td>
        <td>{g.first} → {g.last}</td>
        <td>
          {#if g.problem === 'unplaced'}none{:else}<a href="{TICKETS_URL}/{PROBLEMS[g.problem].ticket}">#{PROBLEMS[g.problem].ticket}</a>{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
</style>
