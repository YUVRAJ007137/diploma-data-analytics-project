"use client";

/**
 * Overview cards: Total Students, Average %, Pass %, Distinction Count.
 */
export default function SummaryCards({ overview }) {
  if (!overview) return null;

  const cards = [
    { label: "Total Students", value: overview.totalStudents, color: "bg-slate-100 text-slate-800 border-slate-200" },
    { label: "Average Percentage", value: `${overview.averagePercentage}%`, color: "bg-blue-50 text-blue-800 border-blue-200" },
    { label: "Pass Percentage", value: `${overview.passPercentage}%`, color: "bg-green-50 text-green-800 border-green-200" },
    { label: "Distinction Count", value: overview.distinctionCount, color: "bg-amber-50 text-amber-800 border-amber-200" }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-xl border p-4 ${card.color}`}
        >
          <p className="text-sm font-medium opacity-90">{card.label}</p>
          <p className="mt-1 text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
