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

const PASS_COLOR = "#22c55e";
const FAIL_COLOR = "#ef4444";
const CHART_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2"];

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
          label={({ name, value }) => `${name}: ${value}`}
        >
          <Cell fill={PASS_COLOR} />
          <Cell fill={FAIL_COLOR} />
        </Pie>
        <Tooltip />
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="subject" angle={-35} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="average" name="Average marks" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="averagePercentage"
          name="Avg %"
          stroke={CHART_COLORS[0]}
          strokeWidth={2}
          dot={{ r: 4 }}
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="range" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="count" name="Students" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyChart({ message }) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-500">
      {message}
    </div>
  );
}
