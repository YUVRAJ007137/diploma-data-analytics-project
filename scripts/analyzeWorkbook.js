/**
 * One-off script to test parsing W25.xlsx. Run: node scripts/analyzeWorkbook.js
 */
const XLSX = require("xlsx");
const path = require("path");

const filePath = path.join(__dirname, "..", "W25.xlsx");
const wb = XLSX.readFile(filePath);

const HEADER_ROW = 5;
const DATA_START_ROW = 6;
const SEAT_COL = 1;
const ENROLLMENT_COL = 2;
const NAME_COL = 3;

function toNum(v) {
  if (v == null || v === "") return null;
  const s = String(v).trim();
  if (/^(EX|DS|NA|AB|--)$/i.test(s)) return null;
  const n = Number(s.replace(/[^0-9.-]/g, ""));
  return Number.isNaN(n) ? null : n;
}

for (const name of ["CO1K", "CO3K", "CO5K"]) {
  const sheet = wb.Sheets[name];
  if (!sheet) continue;
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  const headerRow = rows[HEADER_ROW] || [];
  const totalCol = headerRow.findIndex((v) => {
    const n = toNum(v);
    return n !== null && n >= 500 && n <= 1000;
  });
  let count = 0;
  for (let r = DATA_START_ROW; r < rows.length; r++) {
    const row = rows[r];
    const seat = row[SEAT_COL] != null ? String(row[SEAT_COL]).trim() : "";
    const enrol = row[ENROLLMENT_COL] != null ? String(row[ENROLLMENT_COL]).trim() : "";
    const nm = row[NAME_COL] != null ? String(row[NAME_COL]).trim() : "";
    if ((seat || enrol) && nm) count++;
  }
  console.log(name, "totalCol index:", totalCol, "student rows:", count);
}
