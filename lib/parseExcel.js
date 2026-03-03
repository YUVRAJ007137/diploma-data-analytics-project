/**
 * Excel parser for Diploma result sheets (CO1K, CO3K, CO5K).
 *
 * Expected Excel header structure (rows above data):
 *   Row N-2 : Abbreviation   — subject codes like OSY, STE, ENDS (repeats per sub-column)
 *   Row N-1 : Passing Head   — sub-column types: SA-TH, FA-TH, TOTAL, SLA, SA-PR, FA-PR, TOTAL …
 *   Row N   : Header         — Seat Number | Enrollment Number | Student Name | (max marks …)
 *   Row N+1…: Student data
 *
 * For each subject we only read the sub-columns whose Passing Head label is exactly
 * "TOTAL" (the pre-summed value in the sheet), so we never double-count components.
 */

const XLSX = require("xlsx");

const ALLOWED_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];
const ALLOWED_EXTENSIONS = [".xlsx", ".xls"];

function validateExcelFile(file) {
  if (!file) return { valid: false, error: "No file provided" };
  const name = (file.name || "").toLowerCase();
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
  if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_TYPES.includes(file.type))
    return { valid: false, error: "Invalid file format. Use .xlsx or .xls" };
  return { valid: true };
}

function toNumber(value) {
  if (value == null || value === "") return NaN;
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Find the header row (contains "Seat" / "Enrollment" / "Student Name").
 */
function findHeaderRow(rows) {
  for (let r = 0; r < Math.min(15, rows.length); r++) {
    const text = (rows[r] || [])
      .slice(0, 6)
      .map((c) => String(c || "").toLowerCase())
      .join(" ");
    if (text.includes("seat") || text.includes("enrollment") || text.includes("student name"))
      return r;
  }
  return 5;
}

/**
 * Build per-subject column mappings using abbreviation row and passing-head row.
 *
 * abbreviationRow (headerRowIndex - 2): OSY | OSY | OSY | OSY | OSY | OSY | STE | STE …
 * passingHeadRow  (headerRowIndex - 1): SA-TH | FA-TH | TOTAL | SLA | SA-PR | FA-PR | TOTAL …
 *
 * We group columns by their abbreviation code, then within each group keep only
 * the columns whose passing-head label is "TOTAL". This avoids summing SA + FA + TOTAL.
 * If no TOTAL column exists in a group (edge case), we fall back to summing all columns.
 */
function buildSubjectColumns(rows, headerRowIndex) {
  const abbrRow = headerRowIndex >= 2 ? rows[headerRowIndex - 2] || [] : [];
  const headRow = headerRowIndex >= 1 ? rows[headerRowIndex - 1] || [] : [];
  const headerRow = rows[headerRowIndex] || [];
  const colCount = Math.max(abbrRow.length, headRow.length, headerRow.length);

  const grouped = {};

  for (let c = 3; c < colCount; c++) {
    const rawAbbr = String(abbrRow[c] || "").trim();
    const rawHead = String(headRow[c] || "").trim();

    const code =
      rawAbbr && /^[A-Z0-9]{2,6}$/i.test(rawAbbr)
        ? rawAbbr.toUpperCase()
        : null;

    if (!code) continue;

    if (!grouped[code]) grouped[code] = { totalCols: [], allCols: [] };
    grouped[code].allCols.push(c);

    if (/^total$/i.test(rawHead)) {
      grouped[code].totalCols.push(c);
    }
  }

  return Object.entries(grouped).map(([code, { totalCols, allCols }]) => ({
    code,
    colIndices: totalCols.length > 0 ? totalCols : allCols,
  }));
}

/**
 * Find the result column (AJ column) that contains values like "First Class", "Fail", "A.T.K.T.".
 * Column AJ in Excel = 36th column = 0-based index 35.
 * Also tries to detect by header text (Result, Class, Grade, Division).
 */
function findResultColumnIndex(rows, headerRowIndex) {
  const headerRow = rows[headerRowIndex] || [];
  const abbrRow = headerRowIndex >= 2 ? rows[headerRowIndex - 2] || [] : [];
  const headRow = headerRowIndex >= 1 ? rows[headerRowIndex - 1] || [] : [];
  const searchRows = [headerRow, headRow, abbrRow];
  const keywords = ["result", "class", "grade", "division", "status", "outcome"];
  for (let c = 0; c < Math.max(headerRow.length, 36); c++) {
    for (const row of searchRows) {
      const val = String(row[c] || "").trim().toLowerCase();
      if (keywords.some((kw) => val.includes(kw))) return c;
    }
  }
  return 35;
}

/**
 * Find a standalone grand-total column (not tied to any subject).
 * Looks in the passing-head row for a lone "TOTAL" whose abbreviation row is empty
 * or also says "TOTAL" — or as a last resort, the very last numeric column.
 */
function findGrandTotalColumn(rows, headerRowIndex) {
  const abbrRow = headerRowIndex >= 2 ? rows[headerRowIndex - 2] || [] : [];
  const headRow = headerRowIndex >= 1 ? rows[headerRowIndex - 1] || [] : [];
  const headerRow = rows[headerRowIndex] || [];

  for (let c = headerRow.length - 1; c >= 3; c--) {
    const abbr = String(abbrRow[c] || "").trim().toLowerCase();
    const head = String(headRow[c] || "").trim().toLowerCase();
    const label = String(headerRow[c] || "").trim().toLowerCase();
    if (
      label === "total" ||
      label === "grand total" ||
      (head === "total" && (!abbr || abbr === "total"))
    )
      return c;
  }
  return -1;
}

function parseWorkbook(arrayBuffer, sheetName) {
  const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });
  const sheet = sheetName
    ? workbook.Sheets[sheetName]
    : workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("No sheet found");

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  if (!rows.length)
    return { students: [], meta: { subjectKeys: [], totalColumnIndex: -1, headerRowIndex: 0 } };

  const headerRowIndex = findHeaderRow(rows);
  const grandTotalCol = findGrandTotalColumn(rows, headerRowIndex);
  const resultColIndex = findResultColumnIndex(rows, headerRowIndex);
  const subjectCols = buildSubjectColumns(rows, headerRowIndex);

  const students = [];
  const dataStart = headerRowIndex + 1;

  for (let r = dataStart; r < rows.length; r++) {
    const row = rows[r] || [];
    const seat = row[0] != null ? String(row[0]).trim() : "";
    const enrollment = row[1] != null ? String(row[1]).trim() : "";
    const name = row[2] != null ? String(row[2]).trim() : "";
    if (!seat && !enrollment && !name) continue;

    const subjects = {};
    let sum = 0;

    for (const { code, colIndices } of subjectCols) {
      let subjectTotal = 0;
      for (const ci of colIndices) {
        const val = toNumber(row[ci]);
        if (!Number.isNaN(val)) subjectTotal += val;
      }
      subjects[code] = Math.round(subjectTotal * 100) / 100;
      sum += subjectTotal;
    }

    let totalMarks = NaN;
    if (grandTotalCol >= 0) totalMarks = toNumber(row[grandTotalCol]);
    if (Number.isNaN(totalMarks)) totalMarks = sum;
    totalMarks = Math.round(totalMarks * 100) / 100;

    const resultStatus =
      resultColIndex >= 0 && row[resultColIndex] != null
        ? String(row[resultColIndex]).trim()
        : "";

    students.push({
      seatNumber: seat,
      enrollmentNumber: enrollment,
      studentName: name,
      subjects,
      totalMarks,
      resultStatus,
    });
  }

  return {
    students,
    meta: {
      subjectKeys: subjectCols.map((s) => s.code),
      totalColumnIndex: grandTotalCol,
      headerRowIndex,
    },
  };
}

module.exports = {
  validateExcelFile,
  parseWorkbook,
  ALLOWED_EXTENSIONS,
  ALLOWED_TYPES,
};
