"use client";

/**
 * Overview cards: Total Students, Average %, Pass %, Distinction Count.
 */
export default function SummaryCards({ overview }) {
  if (!overview) return null;

  const cards = [
    {
      label: "Total Students",
      value: overview.totalStudents,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      gradient: "from-slate-500/20 to-slate-600/10",
      iconBg: "bg-slate-500/20",
      iconColor: "text-slate-300",
      valueColor: "text-white",
      glow: "",
    },
    {
      label: "Average Percentage",
      value: `${overview.averagePercentage}%`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      ),
      gradient: "from-violet-500/20 to-purple-600/10",
      iconBg: "bg-violet-500/20",
      iconColor: "text-violet-400",
      valueColor: "text-violet-300",
      glow: "shadow-violet-500/5",
    },
    {
      label: "Pass Percentage",
      value: `${overview.passPercentage}%`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      gradient: "from-emerald-500/20 to-green-600/10",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-300",
      glow: "shadow-emerald-500/5",
    },
    {
      label: "Distinction Count",
      value: overview.distinctionCount,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      gradient: "from-amber-500/20 to-orange-600/10",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      valueColor: "text-amber-300",
      glow: "shadow-amber-500/5",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`glass-tile bg-gradient-to-br ${card.gradient} ${card.glow} group`}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-400">{card.label}</p>
            <div className={`h-9 w-9 rounded-xl ${card.iconBg} flex items-center justify-center ${card.iconColor} transition-transform duration-300 group-hover:scale-110`}>
              {card.icon}
            </div>
          </div>
          <p className={`text-3xl font-bold ${card.valueColor} tracking-tight`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
