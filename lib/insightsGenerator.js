/**
 * Automatically generate human-readable insights from one or two datasets.
 * Used on dashboard and comparison views.
 */

import {
  getOverviewStats,
  getSubjectAverages,
  getSemesterAverages,
  getPassFailData,
  compareDatasets
} from "./analyzeData";

/**
 * Generate insights for a single dataset (dashboard).
 * @param {object} dataset
 * @returns {string[]}
 */
export function generateInsights(dataset) {
  const insights = [];
  if (!dataset?.semesters) return insights;

  const overview = getOverviewStats(dataset);
  const subjectAvgs = getSubjectAverages(dataset);
  const semesterAvgs = getSemesterAverages(dataset);
  const passFail = getPassFailData(dataset);

  if (overview.totalStudents > 0) {
    insights.push(`Total of ${overview.totalStudents} students in this batch.`);
    insights.push(`Average percentage is ${overview.averagePercentage}%.`);
    insights.push(`Pass percentage is ${overview.passPercentage}%.`);
    if (overview.distinctionCount > 0) {
      insights.push(`${overview.distinctionCount} student(s) secured distinction (75% and above).`);
    }
  }

  if (subjectAvgs.length > 0) {
    const isNumericOnly = (s) => /^\d+$/.test(String(s).trim());
    const sorted = [...subjectAvgs].filter((s) => !isNumericOnly(s.subject)).sort((a, b) => a.average - b.average);
    if (sorted.length > 0) {
      const lowest = sorted[0];
      const highest = sorted[sorted.length - 1];
      insights.push(`"${lowest.subject}" has the lowest average marks (${lowest.average}).`);
      insights.push(`"${highest.subject}" has the highest average marks (${highest.average}).`);
    }
  }

  if (semesterAvgs.length >= 2) {
    const bySem = semesterAvgs.sort((a, b) => String(a.semester).localeCompare(String(b.semester)));
    const best = bySem.reduce((acc, cur) => (cur.averagePercentage > acc.averagePercentage ? cur : acc), bySem[0]);
    const worst = bySem.reduce((acc, cur) => (cur.averagePercentage < acc.averagePercentage ? cur : acc), bySem[0]);
    if (best.semester !== worst.semester) {
      insights.push(`Average class performance is best in ${best.semester} (${best.averagePercentage}%) compared to ${worst.semester} (${worst.averagePercentage}%).`);
    }
  }

  const failCount = passFail.find((d) => d.name === "Fail")?.value ?? 0;
  if (failCount > 0 && overview.totalStudents > 0) {
    insights.push(`${failCount} student(s) did not pass (below 40%).`);
  }

  return insights;
}

/**
 * Generate comparison insights between two datasets (Year A vs Year B).
 * @param {object} datasetA
 * @param {object} datasetB
 * @param {string} [semesterKey] - e.g. CO3K
 * @returns {string[]}
 */
export function generateComparisonInsights(datasetA, datasetB, semesterKey) {
  const insights = [];
  if (!datasetA?.semesters || !datasetB?.semesters) return insights;

  const comp = compareDatasets(datasetA, datasetB, semesterKey);
  const { overviewA, overviewB, labelA, labelB } = comp;

  const pctDiff = overviewB.passPercentage - overviewA.passPercentage;
  if (pctDiff !== 0) {
    const dir = pctDiff > 0 ? "improved" : "dropped";
    insights.push(`Pass percentage ${dir} by ${Math.abs(Math.round(pctDiff * 100) / 100)}% in ${labelB} compared to ${labelA}.`);
  }

  const avgDiff = overviewB.averagePercentage - overviewA.averagePercentage;
  if (avgDiff !== 0) {
    const dir = avgDiff > 0 ? "higher" : "lower";
    insights.push(`Average marks are ${Math.abs(Math.round(avgDiff * 100) / 100)}% ${dir} in ${labelB} compared to ${labelA}.`);
  }

  const distDiff = overviewB.distinctionCount - overviewA.distinctionCount;
  if (distDiff !== 0) {
    insights.push(`Distinction count is ${distDiff > 0 ? "+" : ""}${distDiff} in ${labelB} compared to ${labelA}.`);
  }

  // Subject-wise: find subjects that dropped the most
  const subjectA = new Map(comp.subjectA.map((s) => [s.subject, s.average]));
  const subjectB = new Map(comp.subjectB.map((s) => [s.subject, s.average]));
  const allSubjects = new Set([...subjectA.keys(), ...subjectB.keys()]);
  const subjectDiffs = [];
  for (const sub of allSubjects) {
    const a = subjectA.get(sub);
    const b = subjectB.get(sub);
    if (a != null && b != null) subjectDiffs.push({ subject: sub, diff: b - a });
  }
  subjectDiffs.sort((x, y) => x.diff - y.diff);
  if (subjectDiffs.length > 0 && subjectDiffs[0].diff < 0) {
    const lowest = subjectDiffs[0];
    insights.push(`"${lowest.subject}" has the largest drop in average marks (${Math.round(lowest.diff * 100) / 100}) compared to previous year.`);
  }
  if (subjectDiffs.length > 0 && subjectDiffs[subjectDiffs.length - 1].diff > 0) {
    const highest = subjectDiffs[subjectDiffs.length - 1];
    insights.push(`"${highest.subject}" shows the highest improvement in average marks (+${Math.round(highest.diff * 100) / 100}).`);
  }

  return insights;
}
