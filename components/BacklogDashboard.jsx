"use client";

import { useMemo, useState } from "react";
import { getBacklogSummary, getStudentBacklogHistory } from "@/lib/analyzeData";
import StudentBacklogModal from "./StudentBacklogModal";

export default function BacklogDashboard({ dataset, topN = 10 }) {
  const summary = useMemo(() => (dataset ? getBacklogSummary(dataset, {}, topN) : null), [dataset, topN]);
  const history = useMemo(() => (dataset ? getStudentBacklogHistory(dataset) : []), [dataset]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  if (!dataset) return null;

  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold text-slate-800">Backlog Summary</h3>

      {summary ? (
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
            <div className="text-sm text-slate-500">Total students</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{summary.totalStudents}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
            <div className="text-sm text-slate-500">No backs</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{summary.studentsWithNoBacks}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
            <div className="text-sm text-slate-500">Students with backs</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{summary.studentsWithAnyBack}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
            <div className="text-sm text-slate-500">Average backs</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{summary.averageBacks}</div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">No data available.</p>
      )}

      {/* Distribution */}
      {summary && (
        <div className="mt-6">
          <h4 className="mb-2 text-sm font-semibold text-slate-700">Backlog distribution</h4>
          <div className="flex gap-3 text-sm">
            <div className="rounded-md bg-slate-100 px-3 py-1">0: {summary.distribution["0"]}</div>
            <div className="rounded-md bg-slate-100 px-3 py-1">1: {summary.distribution["1"]}</div>
            <div className="rounded-md bg-slate-100 px-3 py-1">2: {summary.distribution["2"]}</div>
            <div className="rounded-md bg-slate-100 px-3 py-1">3+: {summary.distribution["3+"]}</div>
          </div>
        </div>
      )}

      {/* Top offenders */}
      {summary && summary.topBacklogStudents && summary.topBacklogStudents.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-2 text-sm font-semibold text-slate-700">Top backlog students</h4>
          <ol className="list-decimal list-inside space-y-2">
            {summary.topBacklogStudents.map((s) => (
              <li key={s.key} className="flex items-start justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(s)}
                  className="text-left"
                >
                  <div className="text-sm font-medium text-slate-800">{s.studentName || s.enrollmentNumber || s.key}</div>
                  <div className="text-xs text-slate-500">{s.enrollmentNumber ? `EN: ${s.enrollmentNumber}` : s.seatNumber ? `Seat: ${s.seatNumber}` : null}</div>
                </button>
                <div className="text-sm font-semibold text-rose-600">{s.totalBacks} backs</div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Small history preview */}
      {history && history.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-2 text-sm font-semibold text-slate-700">Recent student backlog preview</h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {history.slice(0, 6).map((s) => (
              <div key={s.key} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-800">{s.studentName || s.enrollmentNumber || s.key}</div>
                  <div className="text-xs text-slate-500">Total: {s.totalBacks}</div>
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  {s.semesterBacks.map((b) => (
                    <div key={b.semester}>{b.semester}: {b.backCount}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <StudentBacklogModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
// Note: no runtime prop-types required; component expects `dataset` shape produced by parseWorkbook
