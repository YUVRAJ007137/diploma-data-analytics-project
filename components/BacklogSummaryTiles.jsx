"use client";

/**
 * Displays key summary metrics for backlog: total students, no backs, with backs, average backs.
 */
export default function BacklogSummaryTiles({ summary }) {
  if (!summary) {
    return <p className="text-slate-500 text-sm">No data available.</p>;
  }

  const tiles = [
    {
      label: "Total students",
      value: summary.totalStudents,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      iconBg: "bg-indigo-500/20",
      iconColor: "text-indigo-400",
      valueColor: "text-white",
    },
    {
      label: "No backs",
      value: summary.studentsWithNoBacks,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-300",
    },
    {
      label: "Students with backs",
      value: summary.studentsWithAnyBack,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      iconBg: "bg-rose-500/20",
      iconColor: "text-rose-400",
      valueColor: "text-rose-300",
    },
    {
      label: "Average backs",
      value: summary.averageBacks,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      ),
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      valueColor: "text-amber-300",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
      {tiles.map((tile) => (
        <div key={tile.label} className="glass-tile group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">{tile.label}</span>
            <div className={`h-9 w-9 rounded-xl ${tile.iconBg} flex items-center justify-center ${tile.iconColor} transition-transform duration-300 group-hover:scale-110`}>
              {tile.icon}
            </div>
          </div>
          <div className={`text-3xl font-bold ${tile.valueColor} tracking-tight`}>
            {tile.value}
          </div>
        </div>
      ))}
    </div>
  );
}
