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
      <div className="empty-state mx-auto max-w-2xl animate-fade-in">
        <div className="h-16 w-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400 mb-6">
          No data yet. Upload a workbook to get started.
        </p>
        <a href="/upload" className="btn-glass btn-primary-glass">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          Go to Upload
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
            {selectedSemester ? (
              <p className="text-sm text-slate-400">
                Showing analysis for <span className="text-indigo-400 font-semibold">{selectedSemester}</span> only.
              </p>
            ) : (
              semesterKeys.length > 1 && (
                <p className="text-sm text-slate-400">
                  Combined analysis across <span className="text-indigo-400 font-semibold">{semesterKeys.join(", ")}</span>.
                </p>
              )
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {options.length > 1 && (
            <select
              value={selectedId ?? 0}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              aria-label="Dataset selector"
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

      {/* Summary Cards */}
      <SummaryCards overview={overview} />

      {/* Charts row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Pass vs Fail</h3>
          </div>
          <PassFailPie data={passFailData} />
        </div>
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Subject-wise Averages</h3>
          </div>
          <SubjectBarChart data={subjectData} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Semester Comparison</h3>
          </div>
          <SemesterLineChart data={semesterData} />
        </div>
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Marks Distribution</h3>
          </div>
          <MarksHistogram data={distributionData} />
        </div>
      </div>

      {/* Insights */}
      <div className="glass-card">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">Insights</h3>
        </div>
        <div className="space-y-3">
          {insights.length > 0 ? (
            insights.map((line, i) => (
              <div key={i} className="flex items-start gap-3 glass-tile">
                <span className="h-6 w-6 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-sm text-slate-300">{line}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No insights for this dataset.</p>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <Leaderboard topStudents={topStudents} />
    </div>
  );
}
