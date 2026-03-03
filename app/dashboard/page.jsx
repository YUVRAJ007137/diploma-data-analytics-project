"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { analyzeAllSemesters, generateInsights } from "@/lib/analyzeData";
import SummaryCards from "@/components/SummaryCards";
import Charts, { SubjectAverageBarChart } from "@/components/Charts";

export default function DashboardPage() {
  const { semesterData, hasAnyData } = useData();

  const { analysisBySemester, aggregatedAnalysis, insights } = useMemo(() => {
    const bySemester = analyzeAllSemesters(semesterData);
    const keys = Object.keys(bySemester).filter((k) => bySemester[k].totalStudents > 0);
    let aggregated = null;
    if (keys.length > 0) {
      const totalStudents = keys.reduce((s, k) => s + bySemester[k].totalStudents, 0);
      const passed = keys.reduce((s, k) => s + bySemester[k].passed, 0);
      const failed = keys.reduce((s, k) => s + bySemester[k].failed, 0);
      const subjectAverages = {};
      keys.forEach((k) => {
        Object.entries(bySemester[k].subjectAverages || {}).forEach(([sub, avg]) => {
          if (!subjectAverages[sub]) subjectAverages[sub] = { sum: 0, count: 0 };
          subjectAverages[sub].sum += avg;
          subjectAverages[sub].count += 1;
        });
      });
      Object.keys(subjectAverages).forEach((k) => {
        const { sum, count } = subjectAverages[k];
        subjectAverages[k] = Math.round((sum / count) * 100) / 100;
      });
      aggregated = {
        totalStudents,
        passed,
        failed,
        passPct: totalStudents ? Math.round((passed / totalStudents) * 10000) / 100 : 0,
        failPct: totalStudents ? Math.round((failed / totalStudents) * 10000) / 100 : 0,
        subjectAverages,
        top10: keys.flatMap((k) => (bySemester[k].top10 || []).map((s) => ({ ...s, semester: k }))).sort((a, b) => (b.totalMarks || 0) - (a.totalMarks || 0)).slice(0, 10),
        atkt: keys.flatMap((k) => (bySemester[k].atkt || []).map((s) => ({ ...s, semester: k }))),
      };
    }
    const insightList = generateInsights(bySemester);
    return { analysisBySemester: bySemester, aggregatedAnalysis: aggregated, insights: insightList };
  }, [semesterData]);

  if (!hasAnyData) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          No data loaded
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Upload CO1K, CO3K, or CO5K Excel files from the Upload page to see the dashboard.
        </p>
        <Link
          href="/upload"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          Go to Upload
        </Link>
      </div>
    );
  }

  const activeSemesters = Object.entries(analysisBySemester).filter(
    ([_, a]) => a.totalStudents > 0
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <Link
          href="/upload"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Upload different files
        </Link>
      </div>

      <SummaryCards analysis={aggregatedAnalysis} title="Overview" />

      <Charts analysis={aggregatedAnalysis} analysisBySemester={analysisBySemester} />

      {insights.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
            AI Insights
          </h2>
          <ul className="list-inside list-disc space-y-2 text-slate-700 dark:text-slate-300">
            {insights.map((text, i) => (
              <li key={i}>{text}</li>
            ))}
          </ul>
        </section>
      )}

      {activeSemesters.map(([key, analysis]) => (
        <section key={key} className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {key} — Details
          </h2>
          <SummaryCards analysis={analysis} title={null} />
          <SubjectAverageBarChart
            subjectAverages={analysis.subjectAverages}
            title={`${key} — Subject-wise average marks`}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Top 10 students
              </h3>
              <div className="max-h-64 overflow-auto text-sm">
                {(analysis.top10 || []).length === 0 ? (
                  <p className="text-slate-500">No data</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-600">
                        <th className="py-2 text-left font-medium">Rank</th>
                        <th className="py-2 text-left font-medium">Name</th>
                        <th className="py-2 text-right font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.top10.map((s) => (
                        <tr key={s.seatNumber || s.enrollmentNumber} className="border-b border-slate-100 dark:border-slate-700">
                          <td className="py-1.5">{s.rank}</td>
                          <td className="py-1.5">{s.studentName || "—"}</td>
                          <td className="py-1.5 text-right">{s.totalMarks ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                ATKT (from result column)
              </h3>
              <div className="max-h-64 overflow-auto text-sm">
                {(analysis.atkt || []).length === 0 ? (
                  <p className="text-slate-500">None</p>
                ) : (
                  <ul className="list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    {analysis.atkt.map((s, i) => (
                      <li key={i}>
                        {s.studentName || s.seatNumber} — {s.failedSubjectCount} failed
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
