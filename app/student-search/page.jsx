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
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Student Search</h1>
      <p className="text-slate-600">
        Search by student name or enrollment number to view performance across semesters.
      </p>

      <div className="card flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-sm font-medium text-slate-700">Search by</label>
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800"
          >
            <option value="name">Student Name</option>
            <option value="enrollment">Enrollment Number</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {searchBy === "enrollment" ? "Enrollment Number" : "Student Name"}
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchBy === "enrollment" ? "e.g. 20123456" : "e.g. John"}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {query.trim() && (
        <div className="space-y-4">
          {groupedByStudent.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
              No students found for &quot;{query}&quot;.
            </div>
          ) : (
            groupedByStudent.map((student, idx) => (
              <div key={idx} className="card">
                <h3 className="text-lg font-semibold text-slate-800">
                  {student.studentName || "—"}
                </h3>
                <p className="text-sm text-slate-600">
                  Enrollment: {student.enrollmentNumber || "—"} · Seat: {student.seatNumber || "—"}
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-600">
                        <th className="py-2 pr-4 font-medium">Year</th>
                        <th className="py-2 pr-4 font-medium">Session</th>
                        <th className="py-2 pr-4 font-medium">Semester</th>
                        <th className="py-2 pr-4 font-medium">Branch</th>
                        <th className="py-2 pr-4 font-medium">%</th>
                        <th className="py-2 pr-4 font-medium">Class</th>
                        <th className="py-2 pr-4 font-medium">Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.records
                        .sort((a, b) => `${a.year}${a.session}`.localeCompare(`${b.year}${b.session}`))
                        .map((rec, i) => (
                          <tr key={i} className="border-b border-slate-100">
                            <td className="py-2 pr-4">{rec.year}</td>
                            <td className="py-2 pr-4">{rec.session}</td>
                            <td className="py-2 pr-4">{rec.semester}</td>
                            <td className="py-2 pr-4">{rec.branch}</td>
                            <td className="py-2 pr-4 font-medium">{rec.percentage != null ? rec.percentage : "—"}</td>
                            <td className="py-2 pr-4">{rec.class || "—"}</td>
                            <td className="py-2 pr-4">{rec.rank != null ? rec.rank : "—"}</td>
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
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
          Enter a name or enrollment number to search.
        </div>
      )}
    </div>
  );
}
