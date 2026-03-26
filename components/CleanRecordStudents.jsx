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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Students with Clean Records
        </h2>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
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
              <div className="h-10 w-10 flex-none rounded-full bg-emerald-100 flex items-center justify-center text-sm font-semibold text-emerald-700">
                {(s.studentName && s.studentName.split(' ').map(p => p[0]).slice(0, 2).join('')) ||
                  (s.enrollmentNumber ? s.enrollmentNumber.slice(-2) : 'NA')}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-800">{s.studentName || s.enrollmentNumber || s.key}</div>
                <div className="muted">
                  {s.enrollmentNumber ? `EN: ${s.enrollmentNumber}` : s.seatNumber ? `Seat: ${s.seatNumber}` : null}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-emerald-600">{s.statusLabel}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
