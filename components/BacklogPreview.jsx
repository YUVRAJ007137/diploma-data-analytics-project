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
      <h4 className="mb-4 text-sm font-semibold text-white flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
        Recent Student Backlog Preview
      </h4>
      <div className="grid gap-3 sm:grid-cols-2">
        {history.slice(0, 6).map((s) => (
          <div key={s.key} className="glass-tile">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-white">{s.studentName || s.enrollmentNumber || s.key}</div>
              <span className="badge badge-indigo">Total: {s.totalBacks}</span>
            </div>
            <div className="space-y-1.5">
              {s.semesterBacks.map((b) => (
                <div key={b.semester} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{b.semester}</span>
                  <span className={`font-semibold ${b.backCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {b.backCount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
