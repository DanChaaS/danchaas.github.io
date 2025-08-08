'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Prompt = { id: number; theme: string; template: string };

export default function Config() {
  const [records, setRecords] = useState<Prompt[]>([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('prompts').select('*');
    setRecords((data as Prompt[]) || []);
  };

  const save = async (id: number, template: string) => {
    await supabase.from('prompts').update({ template }).eq('id', id);
    load();
  };

  const add = async () => {
    const theme = prompt('New theme key');
    if (!theme) return;
    await supabase.from('prompts').insert({ theme, template: '' });
    load();
  };

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Prompt Library</h1>
      {records.map((r) => (
        <div key={r.id} className="border p-2 space-y-2">
          <div className="font-semibold">{r.theme}</div>
          <textarea
            className="w-full border p-1"
            value={r.template}
            onChange={(e) => setRecords(records.map(rec => rec.id === r.id ? { ...rec, template: e.target.value } : rec))}
            rows={4}
          />
          <button className="bg-blue-600 text-white px-2 py-1" onClick={() => save(r.id, r.template)}>Save</button>
        </div>
      ))}
      <button className="bg-gray-200 px-3 py-1" onClick={add}>Add Theme</button>
    </main>
  );
}
