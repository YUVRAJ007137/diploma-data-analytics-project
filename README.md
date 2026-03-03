# Diploma Data Analysis Dashboard

A Next.js 14 (App Router) application for uploading and analyzing diploma result Excel files (CO1K, CO3K, CO5K).

## Features

- **Upload** up to three Excel files (CO1K, CO3K, CO5K) via the Upload page
- **Parse** Excel data into JSON using the `xlsx` package (handles multi-row headers)
- **Analysis** per semester:
  - Total students, pass/fail counts and percentages
  - Subject-wise average marks
  - Top 10 students by total marks
  - ATKT list (students with 1–2 failed subjects)
- **Dashboard** with:
  - Overview cards (Total Students, Pass %, Fail %)
  - Pie chart (Pass vs Fail)
  - Bar chart (Subject averages)
  - Line chart (CO1K vs CO3K vs CO5K comparison)
  - AI Insights (e.g. “CO3K has 12% lower pass rate compared to CO1K”)
- **Tech**: Tailwind CSS, Recharts, no database (data in React state)
- **UX**: Loading state, error handling, file format validation (.xlsx, .xls)

## Project structure

```
/docs
  DATA_ANALYTICS_LOGIC.md   # Full analytics logic (presentation-ready)
  DATA_ANALYTICS_LOGIC.html # Same content, open in browser → Print to PDF
/app
  layout.jsx       # Root layout with header and DataProvider
  page.jsx         # Home page
  globals.css      # Global styles
  /upload
    page.jsx       # File upload form
  /dashboard
    page.jsx       # Dashboard with cards, charts, insights
  /api/analyze
    route.js       # POST: parse Excel files, return JSON
/lib
  parseExcel.js    # Excel parsing (header detection, subject grouping)
  analyzeData.js   # Analysis and AI insights
/components
  SummaryCards.jsx # Overview cards
  Charts.jsx       # Pie, Bar, Line charts (Recharts)
/context
  DataContext.jsx  # Global state for parsed semester data
```

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

3. **Build for production**

   ```bash
   npm run build
   npm start
   ```

## Excel format

- First three columns: **Seat Number**, **Enrollment Number**, **Student Name**
- Header row is auto-detected (row containing “Seat”, “Enrollment”, or “Student Name”)
- Subject abbreviations (e.g. OSY, STE, ENDS) are read from the row above the header; multiple columns per subject are summed into one total per subject
- A column with header “total” (or “grand total”) is used as grand total; otherwise the sum of subject totals is used
- Pass/fail is computed using a **60%** threshold per subject (of the max marks inferred from the data)

## License

MIT
