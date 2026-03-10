# Diploma Result Analytics Platform

A full-stack web app for colleges to upload **MSBTE-style result workbooks** and view analytics dashboards. Built with **Next.js 14 (App Router)**, React, Tailwind CSS, Recharts, and SheetJS (xlsx). No database — data is kept in memory/state.

## Features

- **Upload**: Institution, Branch, Academic Year, Session (Winter/Summer), drag-and-drop .xlsx upload with sheet detection preview (CO1K/CO3K/CO5K for Winter; CO2K/CO4K/CO6K for Summer).
- **Dashboard**: Overview cards (Total Students, Average %, Pass %, Distinction count), Pass vs Fail pie, subject-wise bar chart, semester line chart, marks histogram, auto-generated insights, top 10 leaderboard.
- **Comparison**: Compare Year A vs Year B (e.g. 2024 Winter CO3K vs 2025 Winter CO3K) with pass %, average marks, distinction count, subject averages and comparison insights.
- **Student Search**: Search by name or enrollment number; view performance across semesters.

## Tech Stack

- Next.js 14, React, Tailwind CSS, Recharts, xlsx (SheetJS)

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Upload** to add workbooks, then **Dashboard**, **Comparison**, and **Student Search** as needed.

## Excel Format

- First 5 rows: header/metadata.
- Row 6: column headers (e.g. Seat Number, Enrollment Number, Student Name, subject totals, Grand Total, Percentage, Class, Rank).
- Data from row 7 onward.

Sheet names must match: **Winter** → CO1K, CO3K, CO5K; **Summer** → CO2K, CO4K, CO6K.

## Folder Structure

- `app/` — pages: `/`, `/upload`, `/dashboard`, `/comparison`, `/student-search`
- `components/` — UploadForm, SummaryCards, Charts, Leaderboard, Sidebar
- `lib/` — parseExcel.js, analyzeData.js, insightsGenerator.js
- `context/` — DataContext (in-memory datasets)
