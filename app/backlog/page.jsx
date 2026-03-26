"use client";

import { useMemo, useState } from "react";
import { useDataContext } from "@/context/DataContext";
import { getBacklogSummary, getStudentBacklogHistory } from "@/lib/analyzeData";
import StudentBacklogModal from "@/components/StudentBacklogModal";
import BacklogSummaryTiles from "@/components/BacklogSummaryTiles";
import BacklogDistribution from "@/components/BacklogDistribution";
import TopBacklogStudents from "@/components/TopBacklogStudents";
import BacklogPreview from "@/components/BacklogPreview";

export default function BacklogPage() {
  const { datasets } = useDataContext();
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Use the first dataset (most recent) for backlog analysis
  const dataset = datasets && datasets.length > 0 ? datasets[datasets.length - 1] : null;

  const summary = useMemo(() => (dataset ? getBacklogSummary(dataset, {}, 10) : null), [dataset]);
  const history = useMemo(() => (dataset ? getStudentBacklogHistory(dataset) : []), [dataset]);

  if (!dataset) {
    return (
      <div className="glass-card">
        <div className="text-center py-12">
          <p className="text-lg text-slate-600">No data available. Please upload a workbook first.</p>
          <a href="/upload" className="btn btn-primary mt-4 inline-block">
            Go to Upload
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card">
        <div className="glass-header">
          <div className="rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 p-2 text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 00-1 1v3H5a1 1 0 000 2h3v3a1 1 0 102 0V8h3a1 1 0 100-2H11V3a1 1 0 00-1-1z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Backlog Analytics</h1>
            <p className="muted">Comprehensive overview of student backlogs and failures</p>
          </div>
        </div>
      </div>

      {/* Summary Tiles */}
      <div className="glass-card">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Summary</h2>
        <BacklogSummaryTiles summary={summary} />
      </div>

      {/* Distribution */}
      <div className="glass-card">
        <BacklogDistribution summary={summary} />
      </div>

      {/* Top Offenders */}
      <div className="glass-card">
        <TopBacklogStudents
          students={summary?.topBacklogStudents}
          onSelectStudent={setSelectedStudent}
        />
      </div>

      {/* Preview */}
      <div className="glass-card">
        <BacklogPreview history={history} />
      </div>

      {/* Modal */}
      <StudentBacklogModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
