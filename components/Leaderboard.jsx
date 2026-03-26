"use client";

/**
 * Top N students leaderboard by percentage.
 */
export default function Leaderboard({ topStudents, maxItems = 10 }) {
  const list = (topStudents || []).slice(0, maxItems);
  if (list.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
        No student data available for leaderboard.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl shadow-sm">
      <div className="px-4 py-3 grad-indigo">
        <h3 className="font-semibold text-white">Top {list.length} by Percentage</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-600">
              <th className="px-4 py-2 font-medium">Rank</th>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Seat No.</th>
              <th className="px-4 py-2 font-medium">Enrollment</th>
              <th className="px-4 py-2 font-medium">%</th>
              <th className="px-4 py-2 font-medium">Class</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row.seatNumber || row.enrollmentNumber || row.studentName || row.rank} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-2 font-medium text-slate-700">{row.rank}</td>
                <td className="px-4 py-2 text-slate-800">{row.studentName || "—"}</td>
                <td className="px-4 py-2 text-slate-600">{row.seatNumber || "—"}</td>
                <td className="px-4 py-2 text-slate-600">{row.enrollmentNumber || "—"}</td>
                <td className="px-4 py-2 font-semibold text-slate-800">{row.percentage != null ? row.percentage : "—"}</td>
                <td className="px-4 py-2 text-slate-600">{row.class || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
