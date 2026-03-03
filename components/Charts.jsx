"use client";

/**
 * Chart components for dashboard: Pie (Pass vs Fail), Bar (Subject averages), Line (CO1K vs CO3K vs CO5K).
 */

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
  Line,
} from "recharts";

const PASS_COLOR = "#10b981";
const FAIL_COLOR = "#f59e0b";
const CHART_COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#6366f1"];

export function PassFailPieChart({ analysis }) {
  if (!analysis || (analysis.passed === 0 && analysis.failed === 0)) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-500">No pass/fail data</p>
      </div>
    );
  }

  const data = [
    { name: "Pass", value: analysis.passed, color: PASS_COLOR },
    { name: "Fail", value: analysis.failed, color: FAIL_COLOR },
  ].filter((d) => d.value > 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
        Pass vs Fail
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, "Students"]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SubjectAverageBarChart({ subjectAverages, title = "Subject-wise average marks" }) {
  const entries = subjectAverages
    ? Object.entries(subjectAverages)
        .filter(([name]) => !/^total$/i.test(name) && !/^grand\s*total$/i.test(name))
        .map(([name, value]) => ({ name, value: Number(value) || 0 }))
    : [];

  if (entries.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-500">No subject data</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={entries} margin={{ top: 8, right: 8, left: 8, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => [value, "Avg marks"]} />
          <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} name="Average" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Line chart comparing pass % (or total students) across CO1K, CO3K, CO5K.
 */
export function SemesterComparisonLineChart({ analysisBySemester }) {
  const keys = analysisBySemester ? Object.keys(analysisBySemester).filter(Boolean) : [];
  const data = keys.map((k) => ({
    name: k,
    passPct: analysisBySemester[k].passPct ?? 0,
    totalStudents: analysisBySemester[k].totalStudents ?? 0,
    passed: analysisBySemester[k].passed ?? 0,
    failed: analysisBySemester[k].failed ?? 0,
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-500">No comparison data</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
        Comparison: CO1K vs CO3K vs CO5K
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 16, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12, fill: CHART_COLORS[0] }}
            domain={[0, 100]}
            label={{ value: "Pass %", angle: -90, position: "insideLeft", style: { fill: CHART_COLORS[0], fontSize: 12 } }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: CHART_COLORS[1] }}
            label={{ value: "Students", angle: 90, position: "insideRight", style: { fill: CHART_COLORS[1], fontSize: 12 } }}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Pass %") return [`${value}%`, "Pass %"];
              if (name === "Total Students") return [value, "Total Students"];
              return [value, name];
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="passPct"
            stroke={CHART_COLORS[0]}
            strokeWidth={2}
            dot={{ r: 5 }}
            name="Pass %"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="totalStudents"
            stroke={CHART_COLORS[1]}
            strokeWidth={2}
            dot={{ r: 5 }}
            name="Total Students"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Charts({ analysis, analysisBySemester }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PassFailPieChart analysis={analysis} />
        <SemesterComparisonLineChart analysisBySemester={analysisBySemester} />
      </div>
    </div>
  );
}
