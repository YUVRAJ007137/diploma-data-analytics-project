"use client";

import { useMemo, useState } from "react";
import { useDataContext } from "@/context/DataContext";
import { getBacklogSummary, getStudentBacklogHistory } from "@/lib/analyzeData";
import StudentBacklogModal from "@/components/StudentBacklogModal";
import BacklogSummaryTiles from "@/components/BacklogSummaryTiles";
import BacklogDistribution from "@/components/BacklogDistribution";
import TopBacklogStudents from "@/components/TopBacklogStudents";
import BacklogPreview from "@/components/BacklogPreview";

export default function BacklogPage() {
  const { datasets } = useDataContext();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // Get unique years and branches from datasets
  const years = useMemo(() => {
    const uniqueYears = [...new Set(datasets.map((d) => d.year))].sort((a, b) => b - a);
    return uniqueYears;
  }, [datasets]);

  const branches = useMemo(() => {
    const filtered = selectedYear
      ? datasets.filter((d) => d.year === parseInt(selectedYear))
      : datasets;
    const uniqueBranches = [...new Set(filtered.map((d) => d.branch))].sort();
    return uniqueBranches;
  }, [datasets, selectedYear]);

  // Filter dataset based on selected filters
  const dataset = useMemo(() => {
    if (datasets.length === 0) return null;

    let filtered = [...datasets];

    if (selectedYear) {
      filtered = filtered.filter((d) => d.year === parseInt(selectedYear));
    }

    if (selectedBranch) {
      filtered = filtered.filter((d) => d.branch === selectedBranch);
    }

    // If filters are applied, return the first matching dataset
    // Otherwise return the most recent dataset
    return filtered.length > 0 ? filtered[filtered.length - 1] : null;
  }, [datasets, selectedYear, selectedBranch]);

  // Get unique semesters from selected dataset
  const semesters = useMemo(() => {
    if (!dataset || !dataset.semesters) return [];
    const semesterList = Object.keys(dataset.semesters).sort();
    return semesterList;
  }, [dataset]);

  const summary = useMemo(() => {
    if (!dataset) return null;
    // If semester is selected, filter by that semester
    if (selectedSemester && dataset.semesters && dataset.semesters[selectedSemester]) {
      const filteredDataset = {
        ...dataset,
        semesters: { [selectedSemester]: dataset.semesters[selectedSemester] }
      };
      return getBacklogSummary(filteredDataset, {}, 10);
    }
    return getBacklogSummary(dataset, {}, 10);
  }, [dataset, selectedSemester]);

  const history = useMemo(() => {
    if (!dataset) return [];
    let filteredDataset = dataset;
    if (selectedSemester && dataset.semesters && dataset.semesters[selectedSemester]) {
      filteredDataset = {
        ...dataset,
        semesters: { [selectedSemester]: dataset.semesters[selectedSemester] }
      };
    }
    return getStudentBacklogHistory(filteredDataset);
  }, [dataset, selectedSemester]);

  if (!dataset) {
    return (
      <div className="empty-state mx-auto max-w-2xl animate-fade-in">
        <div className="h-16 w-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-lg text-slate-300 font-medium mb-2">No data available</p>
        <p className="text-sm text-slate-500 mb-6">Please upload a workbook first.</p>
        <a href="/upload" className="btn-glass btn-primary-glass">
          Go to Upload
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card">
        <div className="glass-header">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Backlog Analytics</h1>
            <p className="text-sm text-slate-400">Comprehensive overview of student backlogs and failures</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Year Filter */}
            <div>
              <label htmlFor="year-filter" className="block text-sm font-medium text-slate-300 mb-2">
                Year
              </label>
              <select
                id="year-filter"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setSelectedBranch(""); // Reset branch when year changes
                  setSelectedSemester(""); // Reset semester when year changes
                }}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Filter */}
            <div>
              <label htmlFor="branch-filter" className="block text-sm font-medium text-slate-300 mb-2">
                Branch
              </label>
              <select
                id="branch-filter"
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  setSelectedSemester(""); // Reset semester when branch changes
                }}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div>
              <label htmlFor="semester-filter" className="block text-sm font-medium text-slate-300 mb-2">
                Semester
              </label>
              <select
                id="semester-filter"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
              >
                <option value="">All Semesters</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(selectedYear || selectedBranch || selectedSemester) && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedYear("");
                    setSelectedBranch("");
                    setSelectedSemester("");
                  }}
                  className="w-full px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg text-white text-sm font-medium transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Tiles */}
      <div className="glass-card">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
          Summary
        </h2>
        <BacklogSummaryTiles summary={summary} />
      </div>

      {/* Distribution */}
      <div className="glass-card">
        <BacklogDistribution summary={summary} />
      </div>

      {/* Top Offenders */}
      <div className="glass-card">
        <TopBacklogStudents
          students={summary?.topBacklogStudents}
          onSelectStudent={setSelectedStudent}
        />
      </div>

      {/* Preview */}
      <div className="glass-card">
        <BacklogPreview history={history} />
      </div>

      {/* Modal */}
      <StudentBacklogModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
