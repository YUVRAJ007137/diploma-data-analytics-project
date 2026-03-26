"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

const PASS_COLOR = "#10b981";
const FAIL_COLOR = "#f43f5e";
const CHART_COLORS = ["#6366f1", "#a855f7", "#10b981", "#f59e0b", "#f43f5e", "#06b6d4"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0f0f1a]/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
      {label && <p className="mb-1.5 text-sm font-semibold text-white">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="text-sm" style={{ color: entry.color || '#94a3b8' }}>
          <span className="font-medium">{entry.name}:</span>{" "}
          <span className="text-white font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

/**
 * Pass vs Fail pie chart.
 */
export function PassFailPie({ data }) {
  if (!data?.length) return <EmptyChart message="No pass/fail data" />;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={50}
          strokeWidth={0}
          label={({ name, value }) => `${name}: ${value}`}
        >
          <Cell fill={PASS_COLOR} />
          <Cell fill={FAIL_COLOR} />
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

/**
 * Subject-wise average bar chart.
 */
export function SubjectBarChart({ data }) {
  if (!data?.length) return <EmptyChart message="No subject data" />;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="subject" angle={-35} textAnchor="end" height={80} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="average" name="Average marks" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * Semester comparison line chart (CO1K vs CO3K vs CO5K averages).
 */
export function SemesterLineChart({ data }) {
  if (!data?.length) return <EmptyChart message="No semester data" />;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="semester" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="averagePercentage"
          name="Avg %"
          stroke="url(#lineGrad)"
          strokeWidth={3}
          dot={{ r: 5, fill: '#6366f1', stroke: '#818cf8', strokeWidth: 2 }}
          activeDot={{ r: 7, fill: '#6366f1', stroke: '#c7d2fe', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/**
 * Marks distribution histogram (bucket counts).
 */
export function MarksHistogram({ data }) {
  if (!data?.length) return <EmptyChart message="No distribution data" />;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
        <defs>
          <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" name="Students" fill="url(#histGrad)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyChart({ message }) {
  return (
    <div className="empty-state h-[280px]">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-600 mb-3" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" />
      </svg>
      <p className="text-slate-500 font-medium">{message}</p>
    </div>
  );
}
