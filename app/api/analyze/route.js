/**
 * POST /api/analyze
 * Accepts FormData with files: CO1K, CO3K, CO5K (Excel files).
 * Parses each and returns JSON structure for client state.
 */

import { NextResponse } from "next/server";
import { parseWorkbook } from "@/lib/parseExcel";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const keys = ["CO1K", "CO3K", "CO5K"];
    const result = {};

    for (const key of keys) {
      const file = formData.get(key);
      if (!file || !(file instanceof File)) {
        result[key] = { students: [], meta: { subjectKeys: [], totalColumnIndex: -1, headerRowIndex: 0 } };
        continue;
      }
      const buffer = await file.arrayBuffer();
      const parsed = parseWorkbook(buffer);
      result[key] = { students: parsed.students, meta: parsed.meta };
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Analyze API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to parse Excel files" },
      { status: 400 }
    );
  }
}
