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
      <h4 className="mb-3 text-sm font-medium text-slate-700">Top backlog students</h4>
      <div className="space-y-2">
        {students.map((s) => (
          <div key={s.key} className="glass-tile flex items-center justify-between gap-4 hover:shadow-md">
            <button
              type="button"
              onClick={() => onSelectStudent(s)}
              className="flex items-center gap-3 text-left"
            >
              <div className="h-10 w-10 flex-none rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700">
                {(s.studentName && s.studentName.split(' ').map(p => p[0]).slice(0, 2).join('')) ||
                  (s.enrollmentNumber ? s.enrollmentNumber.slice(-2) : 'NA')}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-800">{s.studentName || s.enrollmentNumber || s.key}</div>
                <div className="muted">
                  {s.enrollmentNumber ? `EN: ${s.enrollmentNumber}` : s.seatNumber ? `Seat: ${s.seatNumber}` : null}
                </div>
              </div>
            </button>
            <div className="text-sm font-semibold text-rose-600">{s.totalBacks} backs</div>
          </div>
        ))}
      </div>
    </div>
  );
}
