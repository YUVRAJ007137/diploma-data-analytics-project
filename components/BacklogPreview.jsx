"use client";

/**
 * Displays a grid preview of recent students with their semester backlog breakdown.
 */
export default function BacklogPreview({ history }) {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h4 className="mb-3 text-sm font-medium text-slate-700">Recent student backlog preview</h4>
      <div className="grid gap-3 sm:grid-cols-2">
        {history.slice(0, 6).map((s) => (
          <div key={s.key} className="glass-tile">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-slate-800">{s.studentName || s.enrollmentNumber || s.key}</div>
              <div className="muted">Total: {s.totalBacks}</div>
            </div>
            <div className="mt-2 text-xs text-slate-600 space-y-1">
              {s.semesterBacks.map((b) => (
                <div key={b.semester} className="flex items-center justify-between">
                  <div>{b.semester}</div>
                  <div className="muted">{b.backCount}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
