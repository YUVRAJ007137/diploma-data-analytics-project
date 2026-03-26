
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
        <div className="rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 p-2 text-white shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 00-1 1v3H5a1 1 0 000 2h3v3a1 1 0 102 0V8h3a1 1 0 100-2H11V3a1 1 0 00-1-1z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Backlog Summary</h3>
          <div className="muted">Quick overview of students with backlog (failures)</div>
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
