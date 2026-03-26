"use client";

import { useMemo, useState } from "react";
import { useDataContext } from "@/context/DataContext";
import { categorizeStudentsByBacklogStatus } from "@/lib/analyzeData";
import StudentBacklogModal from "@/components/StudentBacklogModal";
import ActiveBacklogStudents from "@/components/ActiveBacklogStudents";
import CleanRecordStudents from "@/components/CleanRecordStudents";
import ClearedBacklogStudents from "@/components/ClearedBacklogStudents";

export default function StudentCategoriesPage() {
  const { datasets } = useDataContext();
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Use the most recent dataset
  const dataset = datasets && datasets.length > 0 ? datasets[datasets.length - 1] : null;

  const categories = useMemo(() => {
    if (!dataset) {
      return { activeBacklog: [], neverBacklog: [], clearedBacklog: [] };
    }
    return categorizeStudentsByBacklogStatus(dataset);
  }, [dataset]);

  if (!dataset) {
    return (
      <div className="empty-state mx-auto max-w-2xl animate-fade-in">
        <div className="h-16 w-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
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

  const totalStudents = categories.activeBacklog.length + categories.neverBacklog.length + categories.clearedBacklog.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card">
        <div className="glass-header">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/20 flex items-center justify-center shadow-lg shadow-purple-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Student Categories</h1>
            <p className="text-sm text-slate-400">Classification by backlog status</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3 stagger-children">
        <div className="glass-tile bg-gradient-to-br from-rose-500/10 to-transparent group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Active Backlogs</span>
            <div className="h-9 w-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 transition-transform duration-300 group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-rose-300 tracking-tight">{categories.activeBacklog.length}</div>
          <div className="text-xs text-slate-500 mt-1">students with active backlogs</div>
        </div>
        <div className="glass-tile bg-gradient-to-br from-emerald-500/10 to-transparent group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Clean Records</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 transition-transform duration-300 group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-300 tracking-tight">{categories.neverBacklog.length}</div>
          <div className="text-xs text-slate-500 mt-1">never had any backlog</div>
        </div>
        <div className="glass-tile bg-gradient-to-br from-amber-500/10 to-transparent group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Cleared Backlogs</span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 transition-transform duration-300 group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-300 tracking-tight">{categories.clearedBacklog.length}</div>
          <div className="text-xs text-slate-500 mt-1">cleared previous backlogs</div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Overview
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-tile">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Students</div>
            <div className="text-xl font-bold text-white">{totalStudents}</div>
          </div>
          <div className="glass-tile">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Institution</div>
            <div className="text-sm font-semibold text-white truncate">{dataset.institutionName || "N/A"}</div>
          </div>
          <div className="glass-tile">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Branch</div>
            <div className="text-sm font-semibold text-white truncate">{dataset.branch || "N/A"}</div>
          </div>
          <div className="glass-tile">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Year</div>
            <div className="text-sm font-semibold text-white">{dataset.year} {dataset.session}</div>
          </div>
        </div>
      </div>

      {/* Active Backlog Students */}
      {categories.activeBacklog.length > 0 && (
        <ActiveBacklogStudents
          students={categories.activeBacklog}
          onSelectStudent={setSelectedStudent}
        />
      )}

      {/* Clean Record Students */}
      {categories.neverBacklog.length > 0 && (
        <CleanRecordStudents students={categories.neverBacklog} />
      )}

      {/* Cleared Backlog Students */}
      {categories.clearedBacklog.length > 0 && (
        <ClearedBacklogStudents
          students={categories.clearedBacklog}
          onSelectStudent={setSelectedStudent}
        />
      )}

      {/* Modal */}
      <StudentBacklogModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
