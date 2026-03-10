/**
 * Analytics helpers for result datasets.
 * Computes overview stats, subject-wise averages, pass/fail, distinctions, etc.
 */

/** Minimum percentage to be considered pass (e.g. 40) */
const PASS_PERCENTAGE = 40;
/** Minimum percentage for distinction (e.g. 75) */
const DISTINCTION_PERCENTAGE = 75;

/**
 * Get all students from a dataset (flattened across semesters).
 * @param {object} dataset - { semesters: { CO1K: [...], ... } }
 * @returns {object[]}
 */
export function getFlattenedStudents(dataset) {
  if (!dataset?.semesters) return [];
  return Object.entries(dataset.semesters).flatMap(([semester, students]) =>
    (students || []).map((s) => ({ ...s, semester }))
  );
}

/**
 * Deduplicate students by seat/enrollment within a dataset (one record per student across semesters).
 * Prefer record with percentage when multiple exist.
 * @param {object[]} flat
 * @returns {object[]}
 */
function uniqueStudents(flat) {
  const byKey = new Map();
  for (const s of flat) {
    const key = (s.seatNumber || s.enrollmentNumber || s.studentName || "").toString().trim() || `_${Math.random()}`;
    const existing = byKey.get(key);
    if (!existing || (s.percentage != null && (existing.percentage == null || s.percentage > existing.percentage))) {
      byKey.set(key, s);
    }
  }
  return Array.from(byKey.values());
}

/**
 * Overview stats for a single dataset: total students, average %, pass %, distinction count.
 * @param {object} dataset
 * @returns {{ totalStudents: number, averagePercentage: number, passPercentage: number, distinctionCount: number }}
 */
export function getOverviewStats(dataset) {
  const flat = getFlattenedStudents(dataset);
  const unique = uniqueStudents(flat);
  const withPct = unique.filter((s) => s.percentage != null && !Number.isNaN(s.percentage));
  const total = withPct.length;
  const sum = withPct.reduce((a, s) => a + s.percentage, 0);
  const averagePercentage = total > 0 ? sum / total : 0;
  const passed = withPct.filter((s) => s.percentage >= PASS_PERCENTAGE).length;
  const passPercentage = total > 0 ? (passed / total) * 100 : 0;
  const distinctionCount = withPct.filter((s) => s.percentage >= DISTINCTION_PERCENTAGE).length;

  return {
    totalStudents: total,
    averagePercentage: Math.round(averagePercentage * 100) / 100,
    passPercentage: Math.round(passPercentage * 100) / 100,
    distinctionCount
  };
}

/**
 * Pass vs Fail count for pie chart.
 * @param {object} dataset
 * @returns {{ name: string, value: number }[]}
 */
export function getPassFailData(dataset) {
  const flat = getFlattenedStudents(dataset);
  const unique = uniqueStudents(flat);
  const withPct = unique.filter((s) => s.percentage != null && !Number.isNaN(s.percentage));
  const pass = withPct.filter((s) => s.percentage >= PASS_PERCENTAGE).length;
  const fail = withPct.length - pass;
  return [
    { name: "Pass", value: pass },
    { name: "Fail", value: fail }
  ];
}

/**
 * Subject-wise average, min, max (from subjectTotals) across all students in dataset.
 * @param {object} dataset
 * @returns {{ subject: string, average: number, min: number, max: number, count: number }[]}
 */
export function getSubjectAverages(dataset) {
  const flat = getFlattenedStudents(dataset);
  const subjectSums = {};
  const subjectCounts = {};
  const subjectMins = {};
  const subjectMaxs = {};
  for (const s of flat) {
    const totals = s.subjectTotals || {};
    for (const [sub, val] of Object.entries(totals)) {
      if (typeof val !== "number" || Number.isNaN(val)) continue;
      subjectSums[sub] = (subjectSums[sub] || 0) + val;
      subjectCounts[sub] = (subjectCounts[sub] || 0) + 1;
      if (subjectMins[sub] == null || val < subjectMins[sub]) subjectMins[sub] = val;
      if (subjectMaxs[sub] == null || val > subjectMaxs[sub]) subjectMaxs[sub] = val;
    }
  }
  return Object.keys(subjectSums)
    .filter((subject) => !/^\d+$/.test(String(subject).trim()))
    .map((subject) => ({
      subject,
      average: Math.round((subjectSums[subject] / subjectCounts[subject]) * 100) / 100,
      min: subjectMins[subject],
      max: subjectMaxs[subject],
      count: subjectCounts[subject]
    }));
}

/**
 * Semester-wise average percentage (CO1K vs CO3K vs CO5K etc.) for line/bar comparison.
 * @param {object} dataset
 * @returns {{ semester: string, averagePercentage: number, count: number }[]}
 */
export function getSemesterAverages(dataset) {
  if (!dataset?.semesters) return [];
  return Object.entries(dataset.semesters).map(([semester, students]) => {
    const withPct = (students || []).filter((s) => s.percentage != null && !Number.isNaN(s.percentage));
    const sum = withPct.reduce((a, s) => a + s.percentage, 0);
    const count = withPct.length;
    return {
      semester,
      averagePercentage: count > 0 ? Math.round((sum / count) * 100) / 100 : 0,
      count
    };
  });
}

/**
 * Marks distribution buckets for histogram (e.g. 0–20, 21–40, ..., 81–100).
 * @param {object} dataset
 * @param {number} [bucketSize=20]
 * @returns {{ range: string, count: number }[]}
 */
export function getMarksDistribution(dataset, bucketSize = 20) {
  const flat = getFlattenedStudents(dataset);
  const unique = uniqueStudents(flat);
  const withPct = unique.filter((s) => s.percentage != null && !Number.isNaN(s.percentage));
  const buckets = [];
  for (let low = 0; low < 100; low += bucketSize) {
    const high = low + bucketSize;
    const range = high <= 100 ? `${low}-${high}` : `${low}-100`;
    const count = withPct.filter((s) => s.percentage >= low && s.percentage < (high <= 100 ? high : 101)).length;
    buckets.push({ range, count });
  }
  return buckets;
}

/**
 * Top N students by percentage for leaderboard.
 * @param {object} dataset
 * @param {number} [n=10]
 * @returns {object[]}
 */
export function getTopStudents(dataset, n = 10) {
  const flat = getFlattenedStudents(dataset);
  const unique = uniqueStudents(flat);
  const withPct = unique.filter((s) => s.percentage != null && !Number.isNaN(s.percentage));
  return withPct
    .sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0))
    .slice(0, n)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

/**
 * Compare two datasets (e.g. Year A vs Year B) - same branch/session/semester.
 * Returns metrics for both and computed differences.
 * @param {object} datasetA
 * @param {object} datasetB
 * @param {string} [semesterKey] - e.g. CO3K; if not set, uses full dataset
 * @returns {{ labelA: string, labelB: string, overviewA: object, overviewB: object, subjectA: array, subjectB: array }}
 */
export function compareDatasets(datasetA, datasetB, semesterKey) {
  const subA = datasetA?.semesters?.[semesterKey] ? { ...datasetA, semesters: { [semesterKey]: datasetA.semesters[semesterKey] } } : datasetA;
  const subB = datasetB?.semesters?.[semesterKey] ? { ...datasetB, semesters: { [semesterKey]: datasetB.semesters[semesterKey] } } : datasetB;

  const labelA = datasetA ? `${datasetA.year} ${datasetA.session}${semesterKey ? ` ${semesterKey}` : ""}`.trim() : "Dataset A";
  const labelB = datasetB ? `${datasetB.year} ${datasetB.session}${semesterKey ? ` ${semesterKey}` : ""}`.trim() : "Dataset B";

  return {
    labelA,
    labelB,
    overviewA: getOverviewStats(subA),
    overviewB: getOverviewStats(subB),
    subjectA: getSubjectAverages(subA),
    subjectB: getSubjectAverages(subB)
  };
}
