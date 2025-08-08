import { NextResponse } from 'next/server';
import prompts from '../../../../config/prompts.json';
import { getOpenAI } from '@/lib/openai';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const { text, theme } = await req.json();
  const template = (prompts as Record<string, string>)[theme] || (prompts as Record<string, string>)['generic'];
  const prompt = template.replace('[TEXT]', text);
  const openai = getOpenAI();
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    const content = completion.choices[0].message?.content || '{}';
    let analysis: Analysis = JSON.parse(content);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    await supabase.from('incidents').insert({
      theme,
      psirf_category: analysis.psirfCategory,
      system_issues: analysis.systemIssues,
      seips_domains: analysis.seipsDomains,
      learning_response: analysis.learningResponse,
      risk_rating: analysis.riskRating,
      governance_actions: analysis.governanceActions,
      summary: analysis.summary,
      raw_text: text,
    });
    return NextResponse.json(analysis);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

interface Analysis {
  psirfCategory: string;
  systemIssues: string;
  seipsDomains: string;
  learningResponse: string;
  riskRating: string;
  governanceActions: string;
  summary: string;
}
