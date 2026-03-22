"use client";

import { useMemo, useState } from "react";
import { useDataContext } from "@/context/DataContext";
import SummaryCards from "@/components/SummaryCards";
import {
  PassFailPie,
  SubjectBarChart,
  SemesterLineChart,
  MarksHistogram
} from "@/components/Charts";
import Leaderboard from "@/components/Leaderboard";
import {
  getOverviewStats,
  getPassFailData,
  getSubjectAverages,
  getSemesterAverages,
  getMarksDistribution,
  getTopStudents
} from "@/lib/analyzeData";
import { getBacklogSummary } from "@/lib/analyzeData";
import BacklogDashboard from "@/components/BacklogDashboard";
import { generateInsights } from "@/lib/insightsGenerator";

export default function DashboardPage() {
  const { datasets } = useDataContext();
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(""); // "" = All semesters

  const options = useMemo(() => {
    return datasets.map((d, i) => ({
      id: i,
      label: `${d.institutionName || "Institution"} — ${d.branch} — ${d.year} ${d.session}`
    }));
  }, [datasets]);

  const currentDataset = useMemo(() => {
    if (datasets.length === 0) return null;
    const id = selectedId != null && selectedId >= 0 && selectedId < datasets.length
      ? selectedId
      : 0;
    return datasets[id];
  }, [datasets, selectedId]);

  // When a semester is selected, use only that semester's data; otherwise use full dataset (all semesters)
  const effectiveDataset = useMemo(() => {
    if (!currentDataset?.semesters) return currentDataset;
    if (!selectedSemester || !currentDataset.semesters[selectedSemester]) return currentDataset;
    return {
      ...currentDataset,
      semesters: { [selectedSemester]: currentDataset.semesters[selectedSemester] }
    };
  }, [currentDataset, selectedSemester]);

  const semesterKeys = useMemo(
    () => (currentDataset?.semesters ? Object.keys(currentDataset.semesters) : []),
    [currentDataset]
  );

  const overview = useMemo(
    () => (effectiveDataset ? getOverviewStats(effectiveDataset) : null),
    [effectiveDataset]
  );
  const passFailData = useMemo(
    () => (effectiveDataset ? getPassFailData(effectiveDataset) : []),
    [effectiveDataset]
  );
  const subjectData = useMemo(
    () => (effectiveDataset ? getSubjectAverages(effectiveDataset) : []),
    [effectiveDataset]
  );
  const semesterData = useMemo(
    () => (currentDataset ? getSemesterAverages(currentDataset) : []),
    [currentDataset]
  );
  const distributionData = useMemo(
    () => (effectiveDataset ? getMarksDistribution(effectiveDataset) : []),
    [effectiveDataset]
  );
  const topStudents = useMemo(
    () => (effectiveDataset ? getTopStudents(effectiveDataset, 10) : []),
    [effectiveDataset]
  );
  const insights = useMemo(
    () => (effectiveDataset ? generateInsights(effectiveDataset) : []),
    [effectiveDataset]
  );

  if (datasets.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-4 text-slate-600">
          No data yet. Upload a workbook from the <a href="/upload" className="text-blue-600 underline">Upload</a> page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
        <div className="flex flex-wrap items-center gap-3">
          {options.length > 1 && (
            <select
              value={selectedId ?? 0}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
          {semesterKeys.length > 0 && (
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Semester filter"
            >
              <option value="">All semesters ({semesterKeys.join(", ")})</option>
              {semesterKeys.map((key) => (
                <option key={key} value={key}>
                  {key} only
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {selectedSemester ? (
        <p className="text-sm text-slate-600">
          Showing analysis for <strong>{selectedSemester}</strong> only.
        </p>
      ) : (
        semesterKeys.length > 1 && (
          <p className="text-sm text-slate-600">
            Showing combined analysis across <strong>{semesterKeys.join(", ")}</strong>. Use the semester filter to view one semester.
          </p>
        )
      )}

      <SummaryCards overview={overview} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Pass vs Fail</h3>
          <PassFailPie data={passFailData} />
        </div>
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Subject-wise Averages</h3>
          <SubjectBarChart data={subjectData} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Semester Comparison</h3>
          <SemesterLineChart data={semesterData} />
        </div>
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Marks Distribution</h3>
          <MarksHistogram data={distributionData} />
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Insights</h3>
        <ul className="list-inside list-disc space-y-2 text-slate-700">
          {insights.length > 0 ? (
            insights.map((line, i) => <li key={i}>{line}</li>)
          ) : (
            <li className="text-slate-500">No insights for this dataset.</li>
          )}
        </ul>
      </div>

      <BacklogDashboard dataset={effectiveDataset} />

      <Leaderboard topStudents={topStudents} />
    </div>
  );
}
