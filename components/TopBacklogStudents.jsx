"use client";

/**
 * Displays top backlog students (offenders) with click-to-view details.
 */
export default function TopBacklogStudents({ students, onSelectStudent }) {
  if (!students || students.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h4 className="mb-4 text-sm font-semibold text-white flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Top Backlog Students
      </h4>
      <div className="space-y-2">
        {students.map((s) => (
          <div key={s.key} className="glass-tile flex items-center justify-between gap-4 cursor-pointer group">
            <button
              type="button"
              onClick={() => onSelectStudent(s)}
              className="flex items-center gap-3 text-left flex-1"
            >
              <div className="avatar h-10 w-10 bg-rose-500/15 text-rose-400 border border-rose-500/20 transition-all duration-300 group-hover:border-rose-500/40 group-hover:shadow-[0_0_12px_rgba(244,63,94,0.15)]">
                {(s.studentName && s.studentName.split(' ').map(p => p[0]).slice(0, 2).join('')) ||
                  (s.enrollmentNumber ? s.enrollmentNumber.slice(-2) : 'NA')}
              </div>
              <div>
                <div className="text-sm font-medium text-white group-hover:text-rose-300 transition-colors duration-200">
                  {s.studentName || s.enrollmentNumber || s.key}
                </div>
                <div className="text-xs text-slate-500">
                  {s.enrollmentNumber ? `EN: ${s.enrollmentNumber}` : s.seatNumber ? `Seat: ${s.seatNumber}` : null}
                </div>
              </div>
            </button>
            <span className="badge badge-red">{s.totalBacks} backs</span>
          </div>
        ))}
      </div>
    </div>
  );
}
