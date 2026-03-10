"use client";

import { useCallback, useState } from "react";
import { useDataContext } from "@/context/DataContext";
import { parseWorkbook, detectSheets, WINTER_SHEETS, SUMMER_SHEETS } from "@/lib/parseExcel";
import * as XLSX from "xlsx";

const ACCEPT = ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/**
 * Upload form with drag & drop, validation, and sheet detection preview.
 * On success, adds parsed dataset to context and shows detected sheets.
 */
export default function UploadForm() {
  const { addDataset } = useDataContext();
  const [institutionName, setInstitutionName] = useState("");
  const [branch, setBranch] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [session, setSession] = useState("Winter");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [detectedSheets, setDetectedSheets] = useState(null);

  const expectedSheets = session === "Winter" ? WINTER_SHEETS : SUMMER_SHEETS;

  const validate = useCallback(() => {
    if (!institutionName.trim()) return "Institution name is required.";
    if (!branch.trim()) return "Branch is required.";
    if (!academicYear.trim()) return "Academic year is required.";
    if (!file) return "Please upload a workbook (.xlsx).";
    return null;
  }, [institutionName, branch, academicYear, file]);

  /** On file select/drop: validate type and run sheet detection preview (no full parse). */
  const handleFileChange = useCallback(
    async (fileItem) => {
      setError("");
      setSuccess("");
      setDetectedSheets(null);
      if (!fileItem) {
        setFile(null);
        return;
      }
      const name = (fileItem.name || "").toLowerCase();
      if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) {
        setError("Only .xlsx workbooks are supported.");
        setFile(null);
        return;
      }
      setFile(fileItem);
      try {
        const buffer = await fileItem.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const detected = detectSheets(workbook, session);
        setDetectedSheets(detected);
      } catch {
        setDetectedSheets(null);
      }
    },
    [session]
  );

  /** Full parse and add to context (on Submit). */
  const handleFile = useCallback(
    async (fileItem) => {
      if (!fileItem) return;
      setError("");
      setSuccess("");
      setLoading(true);
      try {
        const result = await parseWorkbook(fileItem, {
          institutionName: institutionName.trim(),
          branch: branch.trim(),
          academicYear: academicYear.trim(),
          session
        });
        if (result.success) {
          addDataset(result.data);
          setSuccess(`Workbook parsed successfully. ${result.data ? Object.keys(result.data.semesters || {}).length : 0} sheet(s) loaded.`);
          setDetectedSheets(result.detectedSheets || null);
        } else {
          setError(result.error || "Parse failed.");
          setDetectedSheets(result.detectedSheets || null);
        }
      } catch (e) {
        setError(e?.message || "Upload failed.");
      } finally {
        setLoading(false);
      }
    },
    [institutionName, branch, academicYear, session, addDataset]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    handleFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) handleFileChange(f);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="institution" className="mb-1 block text-sm font-medium text-slate-700">
            Institution Name
          </label>
          <input
            id="institution"
            type="text"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. ABC Polytechnic"
          />
        </div>
        <div>
          <label htmlFor="branch" className="mb-1 block text-sm font-medium text-slate-700">
            Branch
          </label>
          <input
            id="branch"
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Computer Engineering"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="year" className="mb-1 block text-sm font-medium text-slate-700">
            Academic Year
          </label>
          <input
            id="year"
            type="text"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. 2025"
          />
        </div>
        <div>
          <label htmlFor="session" className="mb-1 block text-sm font-medium text-slate-700">
            Session
          </label>
          <select
            id="session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Winter">Winter</option>
            <option value="Summer">Summer</option>
          </select>
          <p className="mt-1 text-xs text-slate-500">
            Winter: CO1K, CO3K, CO5K — Summer: CO2K, CO4K, CO6K
          </p>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Upload Workbook (.xlsx)</label>
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`rounded-xl border-2 border-dashed p-6 text-center transition ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50"
          }`}
        >
          <input
            type="file"
            accept={ACCEPT}
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
            id="workbook-file"
          />
          <label htmlFor="workbook-file" className="cursor-pointer">
            {file ? (
              <span className="font-medium text-slate-700">{file.name}</span>
            ) : (
              <span className="text-slate-600">Drag & drop or click to select .xlsx file</span>
            )}
          </label>
        </div>
      </div>

      {/* Sheet detection preview */}
      {detectedSheets && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Detected Sheets</h3>
          <ul className="space-y-2">
            {detectedSheets.expected?.map((name) => {
              const found = detectedSheets.found?.includes(name);
              return (
                <li key={name} className="flex items-center gap-2 text-sm">
                  {found ? (
                    <span className="text-green-600" aria-hidden>✔</span>
                  ) : (
                    <span className="text-red-600" aria-hidden>✘</span>
                  )}
                  <span className={found ? "text-slate-800" : "text-slate-500"}>{name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {success}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Parsing…" : "Upload & Parse"}
        </button>
        <button
          type="button"
          onClick={() => {
            setFile(null);
            setError("");
            setSuccess("");
            setDetectedSheets(null);
          }}
          className="rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-100"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
