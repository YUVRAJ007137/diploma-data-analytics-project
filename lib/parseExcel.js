/**
 * Excel parsing for MSBTE-style result workbooks (W25.xlsx structure).
 * Sheets: CO1K, CO3K, CO5K (Winter) | CO2K, CO4K, CO6K (Summer).
 * Rows 0–5 = headers; row 5 = column labels + max marks; data from row 6.
 * Col 0 = Sr.No, Col 1 = Seat, Col 2 = Enrollment, Col 3 = Name; then subjects; then Total, Percentage, Class, Rank.
 */

import * as XLSX from "xlsx";

export const WINTER_SHEETS = ["CO1K", "CO3K", "CO5K"];
export const SUMMER_SHEETS = ["CO2K", "CO4K", "CO6K"];
export const ALL_SHEET_NAMES = [...WINTER_SHEETS, ...SUMMER_SHEETS];

const HEADER_ROW = 5;
const DATA_START_ROW = 6;
const SEAT_COL = 1;
const ENROLLMENT_COL = 2;
const NAME_COL = 3;
const FIRST_SUBJECT_COL = 4;

function toNum(v) {
  if (v == null || v === "") return null;
  const s = String(v).trim();
  if (/^(EX|DS|NA|AB|--)$/i.test(s)) return null;
  const n = Number(s.replace(/[^0-9.-]/g, ""));
  return Number.isNaN(n) ? null : n;
}

function norm(s) {
  return (s != null ? String(s) : "").toLowerCase().trim();
}

/**
 * Get header row (row 5). Used to find Total, Percentage, Class, Rank columns.
 */
function getHeaderRow(rows) {
  return rows[HEADER_ROW] || [];
}

/**
 * Find column index where header matches a condition.
 * @param {any[]} headerRow - Row 5
 * @param {(val: any, c: number) => boolean} match - return true if this column is the one
 * @param {number} [afterCol] - search only columns after this (inclusive)
 * @param {number} [beforeCol] - search only columns before this (exclusive)
 */
function findColumn(headerRow, match, afterCol = 0, beforeCol = Infinity) {
  for (let c = afterCol; c < Math.min(headerRow.length, beforeCol); c++) {
    if (match(headerRow[c], c)) return c;
  }
  return -1;
}

/**
 * Find grand total column: cell value is 850 or a number in 500–1000.
 */
function findTotalCol(headerRow) {
  return findColumn(headerRow, (val) => {
    const n = toNum(val);
    return n !== null && n >= 500 && n <= 1000;
  });
}

/**
 * Find column where header text contains "percentage".
 */
function findPercentageCol(headerRow) {
  return findColumn(headerRow, (val) => norm(val).includes("percentage"));
}

/**
 * Find column where header text contains "rank".
 */
function findRankCol(headerRow) {
  return findColumn(headerRow, (val) => norm(val).includes("rank"));
}

/**
 * Find column where header text contains "class".
 */
function findClassCol(headerRow) {
  return findColumn(headerRow, (val) => norm(val).includes("class"));
}

/**
 * Detect subject total columns from rows 3 (Abbreviation) and 4 (Passing Head).
 * For each column where row 4 contains "TOTAL", use row 3 as subject name. Exclude grand total column.
 */
function getSubjectTotalColumns(rows, grandTotalCol) {
  const row3 = rows[3] || [];
  const row4 = rows[4] || [];
  const result = [];
  const seenName = new Set();

  for (let c = FIRST_SUBJECT_COL; c < Math.max(row3.length, row4.length); c++) {
    if (c === grandTotalCol) continue;
    const head = norm(row4[c]);
    if (!head.includes("total")) continue;
    const abbrev = (row3[c] != null && String(row3[c]).trim()) ? String(row3[c]).trim() : "";
    if (!abbrev || /^\d+$/.test(abbrev)) continue;
    if (seenName.has(abbrev)) continue;
    seenName.add(abbrev);
    result.push({ index: c, name: abbrev });
  }
  return result;
}

/**
 * Parse one sheet (CO1K, CO3K, etc.) into student records.
 */
export function parseSheet(sheet, sheetName = "Unknown") {
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  const students = [];
  const headerRow = getHeaderRow(rows);
  if (!headerRow.length) return { students, sheetName };

  const totalCol = findTotalCol(headerRow);
  let percentageCol = findPercentageCol(headerRow);
  let rankCol = findRankCol(headerRow);
  let classCol = findClassCol(headerRow);

  if (rankCol < 0 && totalCol >= 0) rankCol = headerRow.length - 1;
  if (classCol < 0 && rankCol >= 0 && rankCol > 0) classCol = rankCol - 1;

  if (percentageCol < 0 && totalCol >= 0) {
    for (let c = totalCol + 1; c < headerRow.length; c++) {
      if (c === rankCol || c === classCol) continue;
      const sample = rows.slice(DATA_START_ROW, DATA_START_ROW + 10).map((r) => toNum(r[c]));
      const inRange = sample.filter((n) => n != null && n >= 0 && n <= 100).length;
      if (sample.length > 0 && inRange / sample.length >= 0.5) {
        percentageCol = c;
        break;
      }
    }
  }

  const subjectCols = getSubjectTotalColumns(rows, totalCol);

  for (let r = DATA_START_ROW; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length < 4) continue;

    const seatNumber = row[SEAT_COL] != null ? String(row[SEAT_COL]).trim() : "";
    const enrollmentNumber = row[ENROLLMENT_COL] != null ? String(row[ENROLLMENT_COL]).trim() : "";
    const studentName = row[NAME_COL] != null ? String(row[NAME_COL]).trim() : "";

    if (!seatNumber && !enrollmentNumber) continue;
    if (!studentName) continue;

    const grandTotal = totalCol >= 0 ? toNum(row[totalCol]) : null;
    let percentage = percentageCol >= 0 ? toNum(row[percentageCol]) : null;
    if (percentage == null && grandTotal != null && grandTotal > 0) {
      percentage = Math.round((grandTotal / 850) * 10000) / 100;
    }
    const classVal = classCol >= 0 ? String(row[classCol] ?? "").trim() : "";
    const rankVal = rankCol >= 0 ? toNum(row[rankCol]) : null;

    const subjectTotals = {};
    for (const { index, name } of subjectCols) {
      const v = toNum(row[index]);
      if (v != null) subjectTotals[name] = v;
    }

    students.push({
      seatNumber,
      enrollmentNumber,
      studentName,
      grandTotal,
      percentage,
      class: classVal,
      rank: rankVal,
      ...(Object.keys(subjectTotals).length > 0 ? { subjectTotals } : {})
    });
  }

  return { students, sheetName };
}

export function detectSheets(workbook, session) {
  const sheetNames = (workbook.SheetNames || []).map((s) => s.trim());
  const expected = session === "Summer" ? SUMMER_SHEETS : WINTER_SHEETS;
  const found = expected.filter((name) => sheetNames.includes(name));
  const missing = expected.filter((name) => !sheetNames.includes(name));
  return { expected, found, missing };
}

export async function parseWorkbook(fileOrBuffer, meta) {
  try {
    let buffer;
    if (fileOrBuffer instanceof ArrayBuffer) {
      buffer = fileOrBuffer;
    } else if (fileOrBuffer && typeof fileOrBuffer.arrayBuffer === "function") {
      buffer = await fileOrBuffer.arrayBuffer();
    } else {
      return { success: false, error: "Invalid file: expected File or ArrayBuffer." };
    }

    const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
    const session = meta.session === "Summer" ? "Summer" : "Winter";
    const detected = detectSheets(workbook, session);

    if (detected.missing.length > 0) {
      return {
        success: false,
        error: `Missing required sheets for ${session}: ${detected.missing.join(", ")}. Found: ${detected.found.join(", ") || "none"}.`,
        detectedSheets: detected
      };
    }

    const semesters = {};
    for (const name of detected.found) {
      const sheet = workbook.Sheets[name];
      if (!sheet) continue;
      const { students } = parseSheet(sheet, name);
      semesters[name] = students;
    }

    const data = {
      institutionName: meta.institutionName || "",
      branch: meta.branch || "",
      year: String(meta.academicYear || ""),
      session,
      semesters
    };

    return {
      success: true,
      data,
      detectedSheets: { expected: detected.expected, found: detected.found, missing: detected.missing }
    };
  } catch (err) {
    return {
      success: false,
      error: err?.message || "Failed to parse workbook."
    };
  }
}
