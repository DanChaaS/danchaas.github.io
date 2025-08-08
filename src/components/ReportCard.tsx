export type Analysis = {
  psirfCategory: string;
  systemIssues: string;
  seipsDomains: string;
  learningResponse: string;
  riskRating: string;
  governanceActions: string;
  summary: string;
};

export default function ReportCard({ data }: { data: Analysis }) {
  if (!data) return null;
  return (
    <div className="bg-white shadow p-6 rounded space-y-2">
      <h2 className="text-xl font-semibold mb-2">Analysis Report</h2>
      <div><strong>PSIRF Category:</strong> {data.psirfCategory}</div>
      <div><strong>System Issues:</strong> {data.systemIssues}</div>
      <div><strong>SEIPS Domains:</strong> {data.seipsDomains}</div>
      <div><strong>Learning Response:</strong> {data.learningResponse}</div>
      <div><strong>Risk Rating:</strong> {data.riskRating}</div>
      <div><strong>Governance Actions:</strong> {data.governanceActions}</div>
      <div><strong>Summary:</strong> {data.summary}</div>
    </div>
  );
}
