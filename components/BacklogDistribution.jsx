"use client";

/**
 * Displays backlog distribution with progress bars (0, 1, 2, 3+ backs).
 */
export default function BacklogDistribution({ summary }) {
  if (!summary) {
    return null;
  }

  const distributionData = [
    { label: '0 Backs', count: summary.distribution['0'], color: 'bg-emerald-500', glow: 'shadow-emerald-500/30' },
    { label: '1 Back', count: summary.distribution['1'], color: 'bg-amber-500', glow: 'shadow-amber-500/30' },
    { label: '2 Backs', count: summary.distribution['2'], color: 'bg-orange-500', glow: 'shadow-orange-500/30' },
    { label: '3+ Backs', count: summary.distribution['3+'], color: 'bg-rose-500', glow: 'shadow-rose-500/30' },
  ];

  return (
    <div className="mt-6">
      <h4 className="mb-4 text-sm font-semibold text-white flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" />
        </svg>
        Backlog Distribution
      </h4>
      <div className="space-y-3">
        {distributionData.map((b) => {
          const pct = summary.totalStudents ? Math.round((b.count / summary.totalStudents) * 100) : 0;
          return (
            <div key={b.label} className="glass-tile">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-white text-sm">{b.label}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{pct}%</span>
                  <span className="text-sm font-semibold text-slate-300">{b.count} students</span>
                </div>
              </div>
              <div className="progress-bar-track">
                <div
                  className={`progress-bar-fill ${b.color} ${b.glow}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
