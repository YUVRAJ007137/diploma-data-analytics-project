"use client";

/**
 * Displays backlog distribution with progress bars (0, 1, 2, 3+ backs).
 */
export default function BacklogDistribution({ summary }) {
  if (!summary) {
    return null;
  }

  const distributionData = [
    { label: '0', count: summary.distribution['0'], color: 'bg-emerald-400' },
    { label: '1', count: summary.distribution['1'], color: 'bg-yellow-400' },
    { label: '2', count: summary.distribution['2'], color: 'bg-orange-400' },
    { label: '3+', count: summary.distribution['3+'], color: 'bg-rose-400' },
  ];

  return (
    <div className="mt-6">
      <h4 className="mb-3 text-sm font-medium text-slate-700">Backlog distribution</h4>
      <div className="space-y-3">
        {distributionData.map((b) => {
          const pct = summary.totalStudents ? Math.round((b.count / summary.totalStudents) * 100) : 0;
          return (
            <div key={b.label} className="glass-tile">
              <div className="flex items-center justify-between">
                <div className="font-medium text-slate-800">{b.label}</div>
                <div className="muted">{b.count} students</div>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                <div className={`${b.color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
