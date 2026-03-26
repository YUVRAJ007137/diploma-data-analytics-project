"use client";

/**
 * Displays students who cleared their backlogs.
 */
export default function ClearedBacklogStudents({ students, onSelectStudent }) {
  if (!students || students.length === 0) {
    return null;
  }

  return (
    <div className="glass-card">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">
            Students Who Cleared Backlogs
          </h2>
        </div>
        <span className="badge badge-amber">
          {students.length}
        </span>
      </div>
      <div className="space-y-2">
        {students.map((s) => (
          <div
            key={s.key}
            className="glass-tile flex items-center justify-between gap-4 cursor-pointer group"
            onClick={() => onSelectStudent?.(s)}
          >
            <div className="flex items-center gap-3">
              <div className="avatar h-10 w-10 bg-amber-500/15 text-amber-400 border border-amber-500/20 transition-all duration-300 group-hover:border-amber-500/40 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                {(s.studentName && s.studentName.split(' ').map(p => p[0]).slice(0, 2).join('')) ||
                  (s.enrollmentNumber ? s.enrollmentNumber.slice(-2) : 'NA')}
              </div>
              <div>
                <div className="text-sm font-medium text-white group-hover:text-amber-300 transition-colors duration-200">
                  {s.studentName || s.enrollmentNumber || s.key}
                </div>
                <div className="text-xs text-slate-500">
                  {s.enrollmentNumber ? `EN: ${s.enrollmentNumber}` : s.seatNumber ? `Seat: ${s.seatNumber}` : null}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="badge badge-amber">{s.statusLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
