"use client";

/**
 * Top N students leaderboard by percentage.
 */
export default function Leaderboard({ topStudents, maxItems = 10 }) {
  const list = (topStudents || []).slice(0, maxItems);
  if (list.length === 0) {
    return (
      <div className="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-600 mb-3" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <p className="text-slate-500 font-medium">No student data available for leaderboard.</p>
      </div>
    );
  }

  const getRankStyle = (rank) => {
    if (rank === 1) return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', emoji: '🥇' };
    if (rank === 2) return { bg: 'bg-slate-400/20', text: 'text-slate-300', border: 'border-slate-400/30', emoji: '🥈' };
    if (rank === 3) return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', emoji: '🥉' };
    return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', emoji: null };
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-white text-lg">Top {list.length} by Percentage</h3>
          <p className="text-sm text-slate-500">Best performing students</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-1.5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Seat No.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Enrollment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">%</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Class</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row) => {
              const style = getRankStyle(row.rank);
              return (
                <tr
                  key={row.seatNumber || row.enrollmentNumber || row.studentName || row.rank}
                  className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors duration-200"
                >
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center h-7 w-7 rounded-lg ${style.bg} ${style.text} text-xs font-bold border ${style.border}`}>
                      {style.emoji || row.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{row.studentName || "—"}</td>
                  <td className="px-4 py-3 text-slate-400">{row.seatNumber || "—"}</td>
                  <td className="px-4 py-3 text-slate-400">{row.enrollmentNumber || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-indigo-300">{row.percentage != null ? row.percentage : "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge badge-indigo">{row.class || "—"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
