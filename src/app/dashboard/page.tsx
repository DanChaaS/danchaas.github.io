'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Stats {
  total: number;
  categories: Record<string, number>;
  responses: Record<string, number>;
  seips: Record<string, number>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('incidents').select('*');
      if (!data) return;
      const categories: Record<string, number> = {};
      const responses: Record<string, number> = {};
      const seips: Record<string, number> = {};
      data.forEach((row: any) => {
        categories[row.psirf_category] = (categories[row.psirf_category] || 0) + 1;
        responses[row.learning_response] = (responses[row.learning_response] || 0) + 1;
        const domains = (row.seips_domains || '').split(',').map((s: string) => s.trim());
        domains.forEach((d: string) => {
          if (!d) return;
          seips[d] = (seips[d] || 0) + 1;
        });
      });
      setStats({ total: data.length, categories, responses, seips });
    };
    load();
  }, []);

  const exportCSV = () => {
    if (!stats) return;
    const lines: string[] = ['Metric,Count'];
    Object.entries(stats.categories).forEach(([k, v]) => lines.push(`Category ${k},${v}`));
    Object.entries(stats.responses).forEach(([k, v]) => lines.push(`Response ${k},${v}`));
    Object.entries(stats.seips).forEach(([k, v]) => lines.push(`SEIPS ${k},${v}`));
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stats.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!stats) return <main className="p-4">Loading...</main>;

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      <div>Total incidents: {stats.total}</div>
      <div>
        <h2 className="font-semibold">PSIRF Categories</h2>
        <ul>{Object.entries(stats.categories).map(([k, v]) => (<li key={k}>{k}: {v}</li>))}</ul>
      </div>
      <div>
        <h2 className="font-semibold">Learning Responses</h2>
        <ul>{Object.entries(stats.responses).map(([k, v]) => (<li key={k}>{k}: {v}</li>))}</ul>
      </div>
      <div>
        <h2 className="font-semibold">SEIPS Domains</h2>
        <ul>{Object.entries(stats.seips).map(([k, v]) => (<li key={k}>{k}: {v}</li>))}</ul>
      </div>
      <button className="bg-gray-200 px-3 py-1 rounded" onClick={exportCSV}>Export CSV</button>
    </main>
  );
}
