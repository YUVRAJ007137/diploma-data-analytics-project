"use client";

/**
 * Displays students with clean records (never had any backlog).
 */
export default function CleanRecordStudents({ students }) {
  if (!students || students.length === 0) {
    return null;
  }

  return (
    <div className="glass-card">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">
            Students with Clean Records
          </h2>
        </div>
        <span className="badge badge-emerald">
          {students.length}
        </span>
      </div>
      <div className="space-y-2">
        {students.map((s) => (
          <div
            key={s.key}
            className="glass-tile flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="avatar h-10 w-10 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                {(s.studentName && s.studentName.split(' ').map(p => p[0]).slice(0, 2).join('')) ||
                  (s.enrollmentNumber ? s.enrollmentNumber.slice(-2) : 'NA')}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{s.studentName || s.enrollmentNumber || s.key}</div>
                <div className="text-xs text-slate-500">
                  {s.enrollmentNumber ? `EN: ${s.enrollmentNumber}` : s.seatNumber ? `Seat: ${s.seatNumber}` : null}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="badge badge-emerald">{s.statusLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
