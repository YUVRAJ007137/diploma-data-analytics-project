/**
 * Analysis utilities for diploma result data.
 * Pass/fail and ATKT are determined from the AJ column (resultStatus), not percentage.
 * Also computes subject-wise averages and top 10 by total marks.
 */

/**
 * Normalize AJ column value for matching (lowercase, trim, collapse spaces/dots).
 */
function normalizeResultStatus(value) {
  if (value == null) return "";
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\./g, "");
}

/**
 * Classify student as passed, failed, or ATKT based on resultStatus (AJ column).
 * Values like "First Class", "First Class with Distinction", "First Class Conditional" -> pass.
 * "Fail" -> fail. "A.T.K.T." / "ATKT" -> ATKT (counted as failed for pass %).
 */
function classifyByResultStatus(resultStatus) {
  const n = normalizeResultStatus(resultStatus);
  if (!n) return { passed: false, failed: true, atkt: false };
  if (n === "fail") return { passed: false, failed: true, atkt: false };
  if (n === "atkt") return { passed: false, failed: true, atkt: true };
  return { passed: true, failed: false, atkt: false };
}

/**
 * Infer max marks per subject from data (for subject averages only).
 */
function inferSubjectMaxMarks(students) {
  const maxBySubject = {};
  for (const s of students) {
    for (const [sub, marks] of Object.entries(s.subjects || {})) {
      const m = Number(marks);
      if (!Number.isFinite(m)) continue;
      if (maxBySubject[sub] == null || m > maxBySubject[sub]) maxBySubject[sub] = m;
    }
  }
  return maxBySubject;
}

/**
 * Analyze semester: pass/fail and ATKT from AJ column (resultStatus); subject averages and top 10 from marks.
 */
function analyzeSemester(students, subjectMaxMarks) {
  if (!students || students.length === 0) {
    return {
      totalStudents: 0,
      passed: 0,
      failed: 0,
      passPct: 0,
      failPct: 0,
      subjectAverages: {},
      top10: [],
      atkt: [],
    };
  }

  const maxMarks = subjectMaxMarks || inferSubjectMaxMarks(students);
  const subjectKeys = Object.keys(maxMarks);
  const subjectSums = {};
  const subjectCounts = {};
  subjectKeys.forEach((k) => {
    subjectSums[k] = 0;
    subjectCounts[k] = 0;
  });

  let passed = 0;
  let failed = 0;
  const atkt = [];

  for (const st of students) {
    const status = classifyByResultStatus(st.resultStatus);
    if (status.passed) passed++;
    else failed++;
    if (status.atkt) atkt.push({ ...st, failedSubjectCount: 1 });

    for (const [sub, marks] of Object.entries(st.subjects || {})) {
      const m = Number(marks);
      if (!Number.isFinite(m)) continue;
      subjectSums[sub] = (subjectSums[sub] || 0) + m;
      subjectCounts[sub] = (subjectCounts[sub] || 0) + 1;
    }
  }

  const subjectAverages = {};
  subjectKeys.forEach((k) => {
    subjectAverages[k] =
      subjectCounts[k] > 0
        ? Math.round((subjectSums[k] / subjectCounts[k]) * 100) / 100
        : 0;
  });

  const sorted = [...students].sort((a, b) => (b.totalMarks || 0) - (a.totalMarks || 0));
  const top10 = sorted.slice(0, 10).map((s, i) => ({ rank: i + 1, ...s }));

  const total = students.length;
  const passPct = total ? Math.round((passed / total) * 10000) / 100 : 0;
  const failPct = total ? Math.round((failed / total) * 10000) / 100 : 0;

  return {
    totalStudents: total,
    passed,
    failed,
    passPct,
    failPct,
    subjectAverages,
    top10,
    atkt,
  };
}

/**
 * Run analysis for each semester key (CO1K, CO3K, CO5K).
 * @param {Record<string, { students: object[], meta?: object }>} semesterData
 * @returns {Record<string, object>} map of semester key to analyzeSemester result
 */
function analyzeAllSemesters(semesterData) {
  const result = {};
  for (const [key, data] of Object.entries(semesterData || {})) {
    const students = data?.students || [];
    const meta = data?.meta || {};
    result[key] = analyzeSemester(students, meta.subjectMaxMarks);
  }
  return result;
}

/**
 * Generate AI-style insights comparing CO1K, CO3K, CO5K.
 * @param {Record<string, object>} analysisBySemester
 * @returns {string[]}
 */
function generateInsights(analysisBySemester) {
  const insights = [];
  const keys = Object.keys(analysisBySemester || {}).filter(Boolean);
  if (keys.length === 0) return insights;

  const passRates = {};
  keys.forEach((k) => {
    passRates[k] = analysisBySemester[k].passPct ?? 0;
  });

  const sortedByPass = [...keys].sort((a, b) => passRates[b] - passRates[a]);
  const highest = sortedByPass[0];
  const lowest = sortedByPass[sortedByPass.length - 1];

  if (keys.length >= 2 && highest !== lowest) {
    const diff = Math.round((passRates[highest] - passRates[lowest]) * 100) / 100;
    insights.push(
      `${lowest} has ${diff}% lower pass rate compared to ${highest}.`
    );
  }

  keys.forEach((k) => {
    const a = analysisBySemester[k];
    if (a.atkt && a.atkt.length > 0) {
      insights.push(
        `${k}: ${a.atkt.length} student(s) with ATKT (1–2 failed subjects).`
      );
    }
  });

  if (keys.length >= 2) {
    const totals = keys.map((k) => analysisBySemester[k].totalStudents);
    const maxT = Math.max(...totals);
    const minT = Math.min(...totals);
    if (maxT !== minT) {
      const kMax = keys.find((k) => analysisBySemester[k].totalStudents === maxT);
      const kMin = keys.find((k) => analysisBySemester[k].totalStudents === minT);
      insights.push(
        `${kMax} has the highest enrollment (${maxT} students) vs ${kMin} (${minT}).`
      );
    }
  }

  const bestSubject = keys.map((k) => {
    const avgs = analysisBySemester[k].subjectAverages || {};
    const entries = Object.entries(avgs);
    if (entries.length === 0) return { key: k, subject: "N/A", avg: 0 };
    const [sub, avg] = entries.reduce((best, curr) => (curr[1] > best[1] ? curr : best));
    return { key: k, subject: sub, avg };
  });
  bestSubject.forEach(({ key, subject, avg }) => {
    insights.push(`${key}: Highest subject average is ${subject} (${avg}).`);
  });

  return insights;
}

module.exports = {
  analyzeSemester,
  analyzeAllSemesters,
  generateInsights,
  inferSubjectMaxMarks,
  classifyByResultStatus,
};
