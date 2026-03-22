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
  let fallbackCounter = 0;
  for (const s of flat) {
    let key = (s.seatNumber || s.enrollmentNumber || s.studentName || "").toString().trim();
    if (!key) {
      // deterministic fallback when no identifying fields are present
      key = `__noid_${fallbackCounter++}`;
    }
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
    // Label keeps the original style; ensure last bucket includes 100.
    const range = high <= 100 ? `${low}-${high}` : `${low}-100`;
    const count = withPct.filter((s) => {
      if (s.percentage == null || Number.isNaN(s.percentage)) return false;
      if (high >= 100) {
        // last bucket: include scores equal to 100
        return s.percentage >= low && s.percentage <= 100;
      }
      return s.percentage >= low && s.percentage < high;
    }).length;
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

/**
 * Build a deterministic map of students from flattened list.
 * Returns Map<key, { entries: object[], info: { studentName, enrollmentNumber, seatNumber } }>
 */
function buildStudentMap(flat) {
  const map = new Map();
  let fallbackCounter = 0;
  for (const s of flat) {
    let key = (s.seatNumber || s.enrollmentNumber || s.studentName || "").toString().trim();
    if (!key) key = `__noid_${fallbackCounter++}`;
    const existing = map.get(key) || { entries: [], info: { studentName: s.studentName, enrollmentNumber: s.enrollmentNumber, seatNumber: s.seatNumber } };
    existing.entries.push(s);
    map.set(key, existing);
  }
  return map;
}

/**
 * Determine backlog count for a single student record using heuristics.
 * Heuristics (in order):
 *  - numeric record.backCount
 *  - array record.failedSubjects / record.backSubjects
 *  - derive from record.subjectTotals using pass threshold
 *
 * options:
 *  - subjectPassMarks: { subjectName: passMark } (absolute marks)
 *  - defaultSubjectMax: number (default 100)
 *  - passThresholdPercent: number (default uses PASS_PERCENTAGE)
 */
function detectBackCount(record, options = {}) {
  if (record == null) return 0;
  if (typeof record.backCount === "number" && Number.isFinite(record.backCount)) return Math.max(0, Math.floor(record.backCount));
  const arr = record.failedSubjects || record.backSubjects;
  if (Array.isArray(arr)) return arr.length;
  const totals = record.subjectTotals;
  if (totals && typeof totals === "object") {
    const { subjectPassMarks = {}, defaultSubjectMax = 100, passThresholdPercent = PASS_PERCENTAGE } = options;
    let count = 0;
    for (const [sub, val] of Object.entries(totals)) {
      if (typeof val !== "number" || Number.isNaN(val)) continue;
      if (subjectPassMarks && subjectPassMarks[sub] != null) {
        if (val < subjectPassMarks[sub]) count++;
      } else {
        const passMark = (defaultSubjectMax * passThresholdPercent) / 100;
        if (val < passMark) count++;
      }
    }
    return count;
  }
  return 0;
}

/**
 * Get backlog history per student across semesters.
 * Returns array of { key, studentName, enrollmentNumber, seatNumber, semesterBacks: [{ semester, backCount }], totalBacks, semestersWithNoBacks, completedDiploma }
 *
 * options are passed to detectBackCount.
 */
export function getStudentBacklogHistory(dataset, options = {}) {
  const flat = getFlattenedStudents(dataset);
  const map = buildStudentMap(flat);
  const out = [];
  for (const [key, { entries, info }] of map.entries()) {
    const semMap = new Map();
    for (const e of entries) {
      const sem = e.semester || "unknown";
      const prev = semMap.get(sem) || 0;
      // sum detected backs for same student/semester
      semMap.set(sem, prev + detectBackCount(e, options));
    }
    const semesterBacks = Array.from(semMap.entries()).map(([semester, backCount]) => ({ semester, backCount }));
    const totalBacks = semesterBacks.reduce((a, s) => a + s.backCount, 0);
    const semestersWithNoBacks = semesterBacks.filter((s) => s.backCount === 0).length;
    out.push({
      key,
      studentName: info.studentName,
      enrollmentNumber: info.enrollmentNumber,
      seatNumber: info.seatNumber,
      semesterBacks,
      totalBacks,
      semestersWithNoBacks,
      completedDiploma: totalBacks === 0
    });
  }
  return out;
}

/**
 * Aggregated backlog summary for the dataset.
 * Returns:
 *  - totalStudents
 *  - studentsWithNoBacks
 *  - studentsWithAnyBack
 *  - averageBacks
 *  - distribution: { "0": count, "1": count, "2": count, "3+": count }
 *  - topBacklogStudents: top N students by totalBacks (default 10)
 */
export function getBacklogSummary(dataset, options = {}, topN = 10) {
  const history = getStudentBacklogHistory(dataset, options);
  const totalStudents = history.length;
  const studentsWithNoBacks = history.filter((s) => s.totalBacks === 0).length;
  const studentsWithAnyBack = totalStudents - studentsWithNoBacks;
  const averageBacks = totalStudents > 0 ? history.reduce((a, s) => a + s.totalBacks, 0) / totalStudents : 0;

  const distribution = { "0": 0, "1": 0, "2": 0, "3+": 0 };
  for (const s of history) {
    if (s.totalBacks === 0) distribution["0"]++;
    else if (s.totalBacks === 1) distribution["1"]++;
    else if (s.totalBacks === 2) distribution["2"]++;
    else distribution["3+"]++;
  }

  const topBacklogStudents = history
    .slice()
    .sort((a, b) => b.totalBacks - a.totalBacks || (a.studentName || "").localeCompare(b.studentName || ""))
    .slice(0, topN);

  return {
    totalStudents,
    studentsWithNoBacks,
    studentsWithAnyBack,
    averageBacks: Math.round(averageBacks * 100) / 100,
    distribution,
    topBacklogStudents
  };
}
