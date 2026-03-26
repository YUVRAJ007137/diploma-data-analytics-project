"use client";

import { useMemo, useState } from "react";
import { useDataContext } from "@/context/DataContext";
import { compareDatasets } from "@/lib/analyzeData";
import { generateComparisonInsights } from "@/lib/insightsGenerator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const SEMESTER_KEYS = ["CO1K", "CO2K", "CO3K", "CO4K", "CO5K", "CO6K"];

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

export default function ComparisonPage() {
  const { datasets } = useDataContext();
  const [yearA, setYearA] = useState(0);
  const [yearB, setYearB] = useState(1);
  const [semesterKey, setSemesterKey] = useState("CO3K");

  const options = useMemo(() => {
    return datasets.map((d, i) => ({
      id: i,
      label: `${d.year} ${d.session} — ${d.branch}`
    }));
  }, [datasets]);

  const datasetA = datasets[yearA] ?? null;
  const datasetB = datasets[yearB] ?? null;

  const comparison = useMemo(() => {
    if (!datasetA || !datasetB) return null;
    return compareDatasets(datasetA, datasetB, semesterKey);
  }, [datasetA, datasetB, semesterKey]);

  const comparisonInsights = useMemo(() => {
    if (!datasetA || !datasetB) return [];
    return generateComparisonInsights(datasetA, datasetB, semesterKey);
  }, [datasetA, datasetB, semesterKey]);

  const barData = useMemo(() => {
    if (!comparison) return [];
    const { overviewA, overviewB, labelA, labelB } = comparison;
    return [
      { name: "Pass %", [labelA]: overviewA.passPercentage, [labelB]: overviewB.passPercentage },
      { name: "Avg %", [labelA]: overviewA.averagePercentage, [labelB]: overviewB.averagePercentage },
      { name: "Distinctions", [labelA]: overviewA.distinctionCount, [labelB]: overviewB.distinctionCount }
    ];
  }, [comparison]);

  const subjectCompareData = useMemo(() => {
    if (!comparison) return [];
    const { subjectA, subjectB, labelA, labelB } = comparison;
    const bySubject = new Map();
    subjectA.forEach((s) =>
      bySubject.set(s.subject, {
        subject: s.subject,
        [labelA]: s.average,
        _labelA: labelA,
        _labelB: labelB,
        _metaA: { average: s.average, min: s.min, max: s.max }
      })
    );
    subjectB.forEach((s) => {
      const row = bySubject.get(s.subject) || { subject: s.subject, _labelA: comparison.labelA, _labelB: comparison.labelB, _metaA: null };
      row[labelB] = s.average;
      row._metaB = { average: s.average, min: s.min, max: s.max };
      bySubject.set(s.subject, row);
    });
    return Array.from(bySubject.values());
  }, [comparison]);

  function SubjectComparisonTooltipContent({ active, payload }) {
    if (!active || !payload?.length) return null;
    const row = payload[0].payload;
    const labelA = row._labelA || "Year A";
    const labelB = row._labelB || "Year B";
    return (
      <div className="rounded-xl border border-white/[0.08] bg-[#0f0f1a]/95 p-4 shadow-2xl backdrop-blur-xl">
        <p className="mb-2 font-semibold text-white">{row.subject}</p>
        <div className="space-y-1.5 text-sm">
          {row._metaA && (
            <div className="text-slate-300">
              <span className="font-medium text-indigo-400">{labelA}</span>
              <span className="ml-2">Avg: {row._metaA.average}</span>
              <span className="ml-2">High: {row._metaA.max}</span>
              <span className="ml-2">Low: {row._metaA.min}</span>
            </div>
          )}
          {row._metaB && (
            <div className="text-slate-300">
              <span className="font-medium text-purple-400">{labelB}</span>
              <span className="ml-2">Avg: {row._metaB.average}</span>
              <span className="ml-2">High: {row._metaB.max}</span>
              <span className="ml-2">Low: {row._metaB.min}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (datasets.length < 2) {
    return (
      <div className="empty-state mx-auto max-w-2xl animate-fade-in">
        <div className="h-16 w-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Comparison</h1>
        <p className="text-slate-400 mb-6">
          Upload at least two workbooks (e.g. different years) to compare.
        </p>
        <a href="/upload" className="btn-glass btn-primary-glass">
          Go to Upload
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500/30 to-indigo-500/20 flex items-center justify-center shadow-lg shadow-purple-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Year vs Year Comparison</h1>
          <p className="text-sm text-slate-400">
            Compare pass percentage, averages, and subject performance across years.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Year A</label>
          <select
            value={yearA}
            onChange={(e) => setYearA(Number(e.target.value))}
          >
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Year B</label>
          <select
            value={yearB}
            onChange={(e) => setYearB(Number(e.target.value))}
          >
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Semester</label>
          <select
            value={semesterKey}
            onChange={(e) => setSemesterKey(e.target.value)}
          >
            {SEMESTER_KEYS.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      {comparison && (
        <>
          {/* Overview Comparison Table */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Overview Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="py-3 pr-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Metric</th>
                    <th className="py-3 pr-4 text-left text-xs font-medium text-indigo-400 uppercase tracking-wider">{comparison.labelA}</th>
                    <th className="py-3 pr-4 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">{comparison.labelB}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/[0.03]">
                    <td className="py-3 pr-4 text-slate-300">Pass %</td>
                    <td className="py-3 pr-4 font-semibold text-white">{comparison.overviewA.passPercentage}%</td>
                    <td className="py-3 pr-4 font-semibold text-white">{comparison.overviewB.passPercentage}%</td>
                  </tr>
                  <tr className="border-b border-white/[0.03]">
                    <td className="py-3 pr-4 text-slate-300">Average %</td>
                    <td className="py-3 pr-4 font-semibold text-white">{comparison.overviewA.averagePercentage}%</td>
                    <td className="py-3 pr-4 font-semibold text-white">{comparison.overviewB.averagePercentage}%</td>
                  </tr>
                  <tr className="border-b border-white/[0.03]">
                    <td className="py-3 pr-4 text-slate-300">Distinction count</td>
                    <td className="py-3 pr-4 font-semibold text-white">{comparison.overviewA.distinctionCount}</td>
                    <td className="py-3 pr-4 font-semibold text-white">{comparison.overviewB.distinctionCount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-card">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-8 w-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Metrics Bar Chart</h3>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="barA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="barB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey={comparison.labelA} fill="url(#barA)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey={comparison.labelB} fill="url(#barB)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Subject Averages Comparison</h3>
              </div>
              {subjectCompareData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={subjectCompareData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                    <YAxis type="category" dataKey="subject" width={100} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                    <Tooltip content={<SubjectComparisonTooltipContent />} />
                    <Legend />
                    <Bar dataKey={comparison.labelA} fill="#6366f1" radius={[0, 6, 6, 0]} />
                    <Bar dataKey={comparison.labelB} fill="#a855f7" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500">No subject data to compare.</p>
              )}
            </div>
          </div>

          {/* Comparison Insights */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Comparison Insights</h3>
            </div>
            <div className="space-y-3">
              {comparisonInsights.length > 0 ? (
                comparisonInsights.map((line, i) => (
                  <div key={i} className="flex items-start gap-3 glass-tile">
                    <span className="h-6 w-6 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-300">{line}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No comparison insights.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
