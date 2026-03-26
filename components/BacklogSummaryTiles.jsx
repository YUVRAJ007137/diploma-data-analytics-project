"use client";

/**
 * Displays key summary metrics for backlog: total students, no backs, with backs, average backs.
 */
export default function BacklogSummaryTiles({ summary }) {
  if (!summary) {
    return <p className="muted">No data available.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-4">
      <div className="glass-tile text-center">
        <div className="muted">Total students</div>
        <div className="mt-2 text-2xl font-semibold text-slate-900">{summary.totalStudents}</div>
      </div>
      <div className="glass-tile text-center">
        <div className="muted">No backs</div>
        <div className="mt-2 text-2xl font-semibold text-slate-900">{summary.studentsWithNoBacks}</div>
      </div>
      <div className="glass-tile text-center">
        <div className="muted">Students with backs</div>
        <div className="mt-2 text-2xl font-semibold text-slate-900">{summary.studentsWithAnyBack}</div>
      </div>
      <div className="glass-tile text-center">
        <div className="muted">Average backs</div>
        <div className="mt-2 text-2xl font-semibold text-slate-900">{summary.averageBacks}</div>
      </div>
    </div>
  );
}
