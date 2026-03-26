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
      <div className="glass-card">
        <div className="text-center py-12">
          <p className="text-lg text-slate-600">No data available. Please upload a workbook first.</p>
          <a href="/upload" className="btn btn-primary mt-4 inline-block">
            Go to Upload
          </a>
        </div>
      </div>
    );
  }

  const totalStudents = categories.activeBacklog.length + categories.neverBacklog.length + categories.clearedBacklog.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card">
        <div className="glass-header">
          <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-400 p-2 text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 15a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Student Categories</h1>
            <p className="muted">Classification by backlog status</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card">
          <div className="text-center">
            <div className="text-sm font-medium text-slate-600 mb-2">Active Backlogs</div>
            <div className="text-3xl font-bold text-red-600">{categories.activeBacklog.length}</div>
            <div className="text-xs muted mt-2">students with active backlogs</div>
          </div>
        </div>
        <div className="glass-card">
          <div className="text-center">
            <div className="text-sm font-medium text-slate-600 mb-2">Clean Records</div>
            <div className="text-3xl font-bold text-emerald-600">{categories.neverBacklog.length}</div>
            <div className="text-xs muted mt-2">never had any backlog</div>
          </div>
        </div>
        <div className="glass-card">
          <div className="text-center">
            <div className="text-sm font-medium text-slate-600 mb-2">Cleared Backlogs</div>
            <div className="text-3xl font-bold text-amber-600">{categories.clearedBacklog.length}</div>
            <div className="text-xs muted mt-2">cleared previous backlogs</div>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Overview</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm text-slate-600">Total Students</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{totalStudents}</div>
          </div>
          <div>
            <div className="text-sm text-slate-600">Institution</div>
            <div className="text-lg font-semibold text-slate-900 mt-1">{dataset.institutionName || "N/A"}</div>
          </div>
          <div>
            <div className="text-sm text-slate-600">Branch</div>
            <div className="text-lg font-semibold text-slate-900 mt-1">{dataset.branch || "N/A"}</div>
          </div>
          <div>
            <div className="text-sm text-slate-600">Year</div>
            <div className="text-lg font-semibold text-slate-900 mt-1">{dataset.year} {dataset.session}</div>
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
