
"use client";

import { useMemo, useState } from "react";
import { getBacklogSummary, getStudentBacklogHistory } from "@/lib/analyzeData";
import StudentBacklogModal from "./StudentBacklogModal";
import BacklogSummaryTiles from "./BacklogSummaryTiles";
import BacklogDistribution from "./BacklogDistribution";
import TopBacklogStudents from "./TopBacklogStudents";
import BacklogPreview from "./BacklogPreview";

export default function BacklogDashboard({ dataset, topN = 10 }) {
  const summary = useMemo(() => (dataset ? getBacklogSummary(dataset, {}, topN) : null), [dataset, topN]);
  const history = useMemo(() => (dataset ? getStudentBacklogHistory(dataset) : []), [dataset]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  if (!dataset) return null;

  return (
    <div className="glass-card">
      <div className="glass-header">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-indigo-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Backlog Summary</h3>
          <div className="text-sm text-slate-400">Quick overview of students with backlog (failures)</div>
        </div>
      </div>

      <div className="mt-6">
        <BacklogSummaryTiles summary={summary} />
      </div>

      <BacklogDistribution summary={summary} />

      <TopBacklogStudents
        students={summary?.topBacklogStudents}
        onSelectStudent={setSelectedStudent}
      />

      <BacklogPreview history={history} />

      <StudentBacklogModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
// Note: no runtime prop-types required; component expects `dataset` shape produced by parseWorkbook
