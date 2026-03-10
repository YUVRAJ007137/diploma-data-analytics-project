"use client";

import { useMemo, useState } from "react";
import { useDataContext } from "@/context/DataContext";
import { compareDatasets } from "@/lib/analyzeData";
import { generateComparisonInsights } from "@/lib/insightsGenerator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const SEMESTER_KEYS = ["CO1K", "CO2K", "CO3K", "CO4K", "CO5K", "CO6K"];

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
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
        <p className="mb-2 font-semibold text-slate-800">{row.subject}</p>
        <div className="space-y-1.5 text-sm text-slate-700">
          {row._metaA && (
            <div>
              <span className="font-medium text-blue-600">{labelA}</span>
              <span className="ml-2">Avg: {row._metaA.average}</span>
              <span className="ml-2">High: {row._metaA.max}</span>
              <span className="ml-2">Low: {row._metaA.min}</span>
            </div>
          )}
          {row._metaB && (
            <div>
              <span className="font-medium text-purple-600">{labelB}</span>
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
      <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Comparison</h1>
        <p className="mt-4 text-slate-600">
          Upload at least two workbooks (e.g. different years) to compare. Go to{" "}
          <a href="/upload" className="text-blue-600 underline">Upload</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Year vs Year Comparison</h1>
      <p className="text-slate-600">
        Compare pass percentage, average marks, distinction count, and subject averages (e.g. 2024 Winter CO3K vs 2025 Winter CO3K).
      </p>

      <div className="card grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Year A</label>
          <select
            value={yearA}
            onChange={(e) => setYearA(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800"
          >
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Year B</label>
          <select
            value={yearB}
            onChange={(e) => setYearB(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800"
          >
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Semester</label>
          <select
            value={semesterKey}
            onChange={(e) => setSemesterKey(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800"
          >
            {SEMESTER_KEYS.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      {comparison && (
        <>
          <div className="card">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">Overview Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="py-2 pr-4 font-medium text-slate-700">Metric</th>
                    <th className="py-2 pr-4 font-medium text-slate-700">{comparison.labelA}</th>
                    <th className="py-2 pr-4 font-medium text-slate-700">{comparison.labelB}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pr-4">Pass %</td>
                    <td className="py-2 pr-4">{comparison.overviewA.passPercentage}%</td>
                    <td className="py-2 pr-4">{comparison.overviewB.passPercentage}%</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pr-4">Average %</td>
                    <td className="py-2 pr-4">{comparison.overviewA.averagePercentage}%</td>
                    <td className="py-2 pr-4">{comparison.overviewB.averagePercentage}%</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pr-4">Distinction count</td>
                    <td className="py-2 pr-4">{comparison.overviewA.distinctionCount}</td>
                    <td className="py-2 pr-4">{comparison.overviewB.distinctionCount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card">
              <h3 className="mb-4 text-lg font-semibold text-slate-800">Metrics Bar Chart</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={comparison.labelA} fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={comparison.labelB} fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h3 className="mb-4 text-lg font-semibold text-slate-800">Subject Averages Comparison</h3>
              {subjectCompareData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={subjectCompareData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="subject" width={100} tick={{ fontSize: 10 }} />
                    <Tooltip content={<SubjectComparisonTooltipContent />} />
                    <Legend />
                    <Bar dataKey={comparison.labelA} fill="#2563eb" radius={[0, 4, 4, 0]} />
                    <Bar dataKey={comparison.labelB} fill="#7c3aed" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500">No subject data to compare.</p>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">Comparison Insights</h3>
            <ul className="list-inside list-disc space-y-2 text-slate-700">
              {comparisonInsights.length > 0 ? (
                comparisonInsights.map((line, i) => <li key={i}>{line}</li>)
              ) : (
                <li className="text-slate-500">No comparison insights.</li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
