"use client";

/**
 * Overview cards for dashboard: Total Students, Pass %, Fail %.
 * Supports single-semester or aggregated view.
 */

export default function SummaryCards({ analysis, title = "Overview", variant = "single" }) {
  if (!analysis) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-500 dark:text-slate-400">No data to display.</p>
      </div>
    );
  }

  const totalStudents = analysis.totalStudents ?? 0;
  const passPct = analysis.passPct ?? 0;
  const failPct = analysis.failPct ?? 0;

  const cards = [
    {
      label: "Total Students",
      value: totalStudents,
      sub: null,
      color: "bg-blue-500",
      textColor: "text-blue-600 dark:text-blue-400",
      bgLight: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Pass %",
      value: `${passPct}%`,
      sub: `${analysis.passed ?? 0} passed`,
      color: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
      bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      label: "Fail %",
      value: `${failPct}%`,
      sub: `${analysis.failed ?? 0} failed`,
      color: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
      bgLight: "bg-amber-50 dark:bg-amber-900/20",
    },
  ];

  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${card.bgLight}`}
          >
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {card.label}
            </p>
            <p className={`mt-1 text-2xl font-bold ${card.textColor}`}>
              {card.value}
            </p>
            {card.sub && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {card.sub}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
