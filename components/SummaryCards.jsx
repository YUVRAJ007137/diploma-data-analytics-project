"use client";

/**
 * Overview cards: Total Students, Average %, Pass %, Distinction Count.
 */
export default function SummaryCards({ overview }) {
  if (!overview) return null;

  const cards = [
    { label: "Total Students", value: overview.totalStudents, color: "bg-white/60 text-slate-900 border-slate-200" },
    { label: "Average Percentage", value: `${overview.averagePercentage}%`, color: "grad-violet" },
    { label: "Pass Percentage", value: `${overview.passPercentage}%`, color: "grad-emerald" },
    { label: "Distinction Count", value: overview.distinctionCount, color: "grad-amber" }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-xl p-4 ${card.color} shadow-sm`}
          style={{ minHeight: 96 }}
        >
          <p className="text-sm font-medium opacity-90">{card.label}</p>
          <p className={`mt-1 text-2xl font-bold ${card.color.includes('grad') ? 'text-white' : 'text-slate-900'}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
