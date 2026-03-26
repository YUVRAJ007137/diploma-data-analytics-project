"use client";

import { useMemo, useState } from "react";
import { useDataContext } from "@/context/DataContext";

export default function StudentSearchPage() {
  const { allStudents } = useDataContext();
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name"); // "name" | "enrollment"

  const results = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return [];
    return allStudents.filter((s) => {
      if (searchBy === "enrollment") {
        return (s.enrollmentNumber || "").toLowerCase().includes(q);
      }
      return (s.studentName || "").toLowerCase().includes(q);
    });
  }, [allStudents, query, searchBy]);

  const groupedByStudent = useMemo(() => {
    const map = new Map();
    for (const r of results) {
      const key = r.enrollmentNumber || r.seatNumber || r.studentName || "";
      if (!map.has(key)) {
        map.set(key, {
          studentName: r.studentName,
          enrollmentNumber: r.enrollmentNumber,
          seatNumber: r.seatNumber,
          records: []
        });
      }
      map.get(key).records.push({
        semester: r.semester,
        year: r.year,
        session: r.session,
        branch: r.branch,
        percentage: r.percentage,
        grandTotal: r.grandTotal,
        class: r.class,
        rank: r.rank
      });
    }
    return Array.from(map.values());
  }, [results]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-indigo-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Student Search</h1>
          <p className="text-sm text-slate-400">
            Search by student name or enrollment number to view performance across semesters.
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="glass-card">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-slate-300">Search by</label>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <option value="name">Student Name</option>
              <option value="enrollment">Enrollment Number</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              {searchBy === "enrollment" ? "Enrollment Number" : "Student Name"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchBy === "enrollment" ? "e.g. 20123456" : "e.g. John"}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {query.trim() && (
        <div className="space-y-4">
          {groupedByStudent.length === 0 ? (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-600 mb-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <p className="text-slate-400 font-medium">No students found for &quot;{query}&quot;.</p>
            </div>
          ) : (
            groupedByStudent.map((student, idx) => (
              <div key={idx} className="glass-card animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                {/* Student header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="avatar h-12 w-12 bg-gradient-to-br from-indigo-500/20 to-cyan-500/15 text-indigo-300 text-base border border-indigo-500/20">
                    {(student.studentName && student.studentName.split(' ').map(p => p[0]).slice(0, 2).join('')) || '?'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {student.studentName || "—"}
                    </h3>
                    <p className="text-sm text-slate-400">
                      Enrollment: {student.enrollmentNumber || "—"} · Seat: {student.seatNumber || "—"}
                    </p>
                  </div>
                </div>

                {/* Performance table */}
                <div className="overflow-x-auto -mx-1.5">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="py-3 pr-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Year</th>
                        <th className="py-3 pr-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Session</th>
                        <th className="py-3 pr-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Semester</th>
                        <th className="py-3 pr-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Branch</th>
                        <th className="py-3 pr-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">%</th>
                        <th className="py-3 pr-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Class</th>
                        <th className="py-3 pr-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.records
                        .sort((a, b) => `${a.year}${a.session}`.localeCompare(`${b.year}${b.session}`))
                        .map((rec, i) => (
                          <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors duration-200">
                            <td className="py-3 pr-4 text-slate-300">{rec.year}</td>
                            <td className="py-3 pr-4 text-slate-300">{rec.session}</td>
                            <td className="py-3 pr-4">
                              <span className="badge badge-indigo">{rec.semester}</span>
                            </td>
                            <td className="py-3 pr-4 text-slate-300">{rec.branch}</td>
                            <td className="py-3 pr-4 font-bold text-indigo-300">{rec.percentage != null ? rec.percentage : "—"}</td>
                            <td className="py-3 pr-4">
                              <span className="badge badge-emerald">{rec.class || "—"}</span>
                            </td>
                            <td className="py-3 pr-4 text-slate-300">{rec.rank != null ? rec.rank : "—"}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!query.trim() && (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-600 mb-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <p className="text-slate-400 font-medium text-lg">Search for a student</p>
          <p className="text-slate-500 text-sm mt-1">Enter a name or enrollment number above to view their records.</p>
        </div>
      )}
    </div>
  );
}
