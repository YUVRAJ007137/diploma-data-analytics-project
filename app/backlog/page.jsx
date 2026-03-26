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
      <div className="empty-state mx-auto max-w-2xl animate-fade-in">
        <div className="h-16 w-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-lg text-slate-300 font-medium mb-2">No data available</p>
        <p className="text-sm text-slate-500 mb-6">Please upload a workbook first.</p>
        <a href="/upload" className="btn-glass btn-primary-glass">
          Go to Upload
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card">
        <div className="glass-header">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Backlog Analytics</h1>
            <p className="text-sm text-slate-400">Comprehensive overview of student backlogs and failures</p>
          </div>
        </div>
      </div>

      {/* Summary Tiles */}
      <div className="glass-card">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
          Summary
        </h2>
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
