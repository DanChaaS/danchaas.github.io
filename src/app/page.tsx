'use client';

import { useState } from 'react';
import ReportCard, { Analysis } from '@/components/ReportCard';
import prompts from '../../config/prompts.json';
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';
import htmlDocx from 'html-docx-js/dist/html-docx';

export default function Home() {
  const themes = Object.keys(prompts);
  const [text, setText] = useState('');
  const [theme, setTheme] = useState('generic');
  const [confirmed, setConfirmed] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.name.endsWith('.txt')) {
      const txt = await file.text();
      setText(txt);
    } else if (file.name.endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setText(result.value);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setAnalysis(null);
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, theme }),
    });
    const data = await res.json();
    setAnalysis(data);
    setLoading(false);
  };

  const exportPDF = () => {
    if (!analysis) return;
    const doc = new jsPDF();
    const content = `PSIRF Category: ${analysis.psirfCategory}\nSystem Issues: ${analysis.systemIssues}\nSEIPS Domains: ${analysis.seipsDomains}\nLearning Response: ${analysis.learningResponse}\nRisk Rating: ${analysis.riskRating}\nGovernance Actions: ${analysis.governanceActions}\nSummary: ${analysis.summary}`;
    doc.text(content, 10, 10);
    doc.save('analysis.pdf');
  };

  const exportDocx = () => {
    if (!analysis) return;
    const html = `<h1>Sentra Analysis</h1><p><strong>PSIRF Category:</strong> ${analysis.psirfCategory}</p><p><strong>System Issues:</strong> ${analysis.systemIssues}</p><p><strong>SEIPS Domains:</strong> ${analysis.seipsDomains}</p><p><strong>Learning Response:</strong> ${analysis.learningResponse}</p><p><strong>Risk Rating:</strong> ${analysis.riskRating}</p><p><strong>Governance Actions:</strong> ${analysis.governanceActions}</p><p><strong>Summary:</strong> ${analysis.summary}</p>`;
    const blob = htmlDocx.asBlob(html);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analysis.docx';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
  };

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Sentra Incident Analysis</h1>
      <ol className="list-decimal list-inside text-sm text-gray-700">
        <li>Input report</li>
        <li>Choose theme</li>
        <li>Confirm anonymisation</li>
        <li>Submit for analysis</li>
      </ol>
      <textarea
        className="w-full border p-2" rows={6}
        placeholder="Paste incident report here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input type="file" accept=".txt,.docx" onChange={handleFile} />
      <div>
        <label className="mr-2 font-medium">Theme:</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)} className="border p-2">
          {themes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="bg-yellow-100 p-2 rounded">
        <p className="text-sm">⚠️ Please confirm this incident report is fully anonymised and contains no patient-identifiable information. By submitting, you agree to comply with data protection guidelines.</p>
        <label className="text-sm"><input type="checkbox" className="mr-2" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />I confirm the report is anonymised.</label>
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleSubmit}
        disabled={!text || !confirmed || loading}
      >{loading ? 'Analysing...' : 'Submit for analysis'}</button>
      {analysis && (
        <div className="space-y-4">
          <ReportCard data={analysis} />
          <div className="flex gap-2">
            <button className="bg-gray-200 px-3 py-1 rounded" onClick={exportPDF}>Export PDF</button>
            <button className="bg-gray-200 px-3 py-1 rounded" onClick={exportDocx}>Export Word</button>
            <button className="bg-gray-200 px-3 py-1 rounded" onClick={copyToClipboard}>Copy</button>
          </div>
        </div>
      )}
    </main>
  );
}
