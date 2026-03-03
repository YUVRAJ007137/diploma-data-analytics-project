# Diploma Data Analysis Dashboard  
## Data Analytics Logic — Presentation Document

---

## 1. Overview

The **Diploma Data Analysis Dashboard** is a web application that:

- Accepts **three Excel result files** (CO1K, CO3K, CO5K)
- **Parses** multi-row Excel headers and student marks
- **Analyzes** each semester for pass/fail, subject averages, rankings, and ATKT
- **Visualizes** results with charts and an AI-generated insights section

**No database** is used; parsed data lives in **React state** for the session.

---

## 2. End-to-End Data Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Excel      │ ──► │  Parse       │ ──► │  Analyze        │ ──►  │  Dashboard   │
│  (CO1K,     │     │  (xlsx)      │     │  (per semester) │      │  (Charts &   │
│   CO3K,     │     │  → JSON      │     │  + Insights     │      │   Cards)     │
│   CO5K)     │     │              │     │                 │      │              │
└─────────────┘     └──────────────┘     └─────────────────┘     └──────────────┘
```

| Stage | What happens |
|-------|----------------|
| **Upload** | User selects one or more Excel files (.xlsx / .xls). Client sends them to `/api/analyze`. |
| **Parse** | Server reads each file with the `xlsx` library, detects headers, extracts student rows and subject marks, returns JSON. |
| **Analyze** | Client runs analysis on parsed data: pass/fail, subject averages, top 10, ATKT, and insight generation. |
| **Display** | Dashboard shows overview cards, pie chart, line chart, and per-file bar charts plus AI insights. |

---

## 3. Excel Parsing Logic

### 3.1 Expected Excel Structure

Diploma result sheets use **multi-row headers**:

| Row role | Typical content | Purpose |
|----------|-----------------|---------|
| **Abbreviation row** (e.g. row 4) | OSY, OSY, OSY, STE, STE, … | Subject code repeated for each sub-column |
| **Passing Head row** (e.g. row 5) | SA-TH, FA-TH, **TOTAL**, SLA, SA-PR, FA-PR, **TOTAL**, … | Type of marks (theory, practical, total) |
| **Header row** (e.g. row 6) | Seat Number, Enrollment Number, Student Name, 70, 30, 100, … | Column labels and/or max marks |
| **Data rows** (from row 7) | Student IDs and marks | One row per student |

First three columns are always: **Seat Number**, **Enrollment Number**, **Student Name**.

### 3.2 Header Detection

- The **header row** is found by scanning the first 15 rows for text containing *"seat"*, *"enrollment"*, or *"student name"* (case-insensitive).
- The **abbreviation row** is taken as **two rows above** the header row.
- The **passing head row** is **one row above** the header row.

### 3.3 Subject Columns and Avoiding Double-Counting

- Columns are **grouped by subject code** from the abbreviation row (e.g. all columns under "OSY" belong to subject OSY).
- Within each subject, **only columns whose passing-head label is exactly "TOTAL"** are used.  
  This uses the sheet’s pre-calculated subject total and avoids summing SA + FA + TOTAL (which would triple-count).
- If a subject has no "TOTAL" column, all its numeric columns are summed as a fallback.

### 3.4 Grand Total and Output Shape

- A **grand total column** is detected by looking for a header (or passing head) like "total" or "grand total", often in the last columns.
- The **result column (AJ)** is detected by header keywords ("result", "class", "grade", "division", "status", "outcome") or column index **35** (Excel column AJ); its value is stored as **resultStatus**.
- Each student row is output as:

```json
{
  "seatNumber": "...",
  "enrollmentNumber": "...",
  "studentName": "...",
  "subjects": { "OSY": 85, "STE": 72, ... },
  "totalMarks": 620,
  "resultStatus": "First Class"
}
```

- **resultStatus** comes from the **AJ column** (result column); see §4.1.
- Numeric values are rounded to **2 decimal places**.

---

## 4. Analysis Logic (Per Semester)

Analysis runs **per file** (CO1K, CO3K, CO5K) on that file’s parsed student list.

### 4.1 Pass / Fail and ATKT (from AJ Column)

- Pass/fail and ATKT are **not** based on percentage. They are read from the **AJ column** (result column) in the Excel sheet.
- The parser detects the result column by header keywords ("result", "class", "grade", "division", "status", "outcome") or falls back to column index **35** (Excel column AJ).
- Each student row gets a **resultStatus** value from that column.
- **Classification:**
  - **Pass:** Any value other than "Fail" or "A.T.K.T." — e.g. "First Class", "First Class with Distinction", "First Class Conditional" (or "First Calss Con"), etc.
  - **Fail:** Exact match (case-insensitive) for "Fail".
  - **ATKT:** Exact match (case-insensitive, dots ignored) for "A.T.K.T." or "ATKT". These students are counted as failed for pass % and appear in the ATKT list.
- Empty or missing result status is treated as **failed**.
- Counts: **passed**, **failed**, **pass %**, **fail %** (of total students).

### 4.2 Subject-Wise Average Marks

- For each subject code (e.g. OSY, STE), the **average marks** over all students who have that subject are computed.
- Result: one average per subject, e.g. `{ "OSY": 78.5, "STE": 65.2, ... }`.
- Any key named "TOTAL" or "Grand total" is **excluded** from the subject-wise bar charts so the chart compares only real subjects.

### 4.3 Top 10 Students

- Students are **sorted by total marks** (descending).
- The **top 10** are taken and displayed with rank, name, and total marks.

### 4.4 ATKT (Allowed To Keep Term)

- **ATKT** = students whose AJ column value is "A.T.K.T." or "ATKT" (allowed to keep terms).
- They are counted as failed for pass % and listed in the ATKT section per semester.


### 4.5 Aggregated Overview (All Files)

- **Total students** = sum of students across CO1K, CO3K, CO5K (each student counted in their file only).
- **Pass / Fail counts and %** = sum of passed and failed across semesters, then percentages over total students.
- **Subject averages (aggregated)** = for each subject, average of the per-semester averages (so each file contributes equally to the overall subject average).

---

## 5. AI Insights Generation

Insights are **rule-based**, comparing semesters and highlighting patterns:

| Insight type | Logic |
|--------------|--------|
| **Pass rate comparison** | Compare pass % across CO1K, CO3K, CO5K; e.g. *"CO3K has 12% lower pass rate compared to CO1K."* |
| **ATKT counts** | Per semester: *"CO3K: 5 student(s) with ATKT."* (from result column). |
| **Enrollment comparison** | Which semester has highest/lowest enrollment; e.g. *"CO1K has the highest enrollment (85 students) vs CO5K (62)."* |
| **Best subject per semester** | For each semester, which subject has the highest average; e.g. *"CO1K: Highest subject average is STE (82)."* |

Only semesters with data are included; insights are shown in a dedicated “AI Insights” section on the dashboard.

---

## 6. Dashboard Visualizations

| Component | Data source | Meaning |
|----------|------------|--------|
| **Overview cards** | Aggregated analysis | Total students, Pass %, Fail % (and counts). |
| **Pass vs Fail (pie)** | Aggregated analysis | Proportion of students who passed vs failed. |
| **Comparison line chart** | Per-semester analysis | **Left Y-axis:** Pass % (0–100). **Right Y-axis:** Total students. One line per metric across CO1K, CO3K, CO5K. |
| **Per-file bar chart** | That file’s `subjectAverages` | **Subject-wise average marks** for that file only (e.g. “CO1K — Subject-wise average marks”). TOTAL is excluded from the bar chart. |
| **Top 10 table** | That file’s analysis | Rank, student name, total marks for that semester. |
| **ATKT list** | That file’s analysis | Students whose AJ column value is "A.T.K.T." or "ATKT" for that semester. |

---

## 7. Technical Summary

| Aspect | Choice |
|--------|--------|
| **Parsing** | `xlsx` on server; header detection and “TOTAL”-only subject columns to avoid decimal/double-count issues. |
| **Pass/fail** | From AJ column (resultStatus): "Fail" → fail, "A.T.K.T."/ATKT → ATKT, else → pass. |
| **ATKT** | From AJ column: students with resultStatus "A.T.K.T." or "ATKT". |
| **State** | React context holds parsed JSON; no database. |
| **Charts** | Recharts (pie, bar, line); dual Y-axis for pass % vs student count. |

---

## 8. Summary

The analytics pipeline:

1. **Parses** Excel with correct header and subject handling and uses only TOTAL columns per subject.
2. **Analyzes** each file using the AJ column for pass/fail and ATKT, and computes subject averages and top 10.
3. **Aggregates** counts and percentages across files for the overview and pie chart.
4. **Generates** comparative and per-semester insights.
5. **Renders** overview cards, pass/fail pie, semester comparison line chart, and **one subject-wise bar chart per file**, plus tables and ATKT lists.

This document describes the data analytics logic behind the Diploma Data Analysis Dashboard in a presentation-ready form.
