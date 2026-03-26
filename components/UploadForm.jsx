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
          <label htmlFor="institution" className="mb-2 block text-sm font-medium text-slate-300">
            Institution Name
          </label>
          <input
            id="institution"
            type="text"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
            placeholder="e.g. ABC Polytechnic"
          />
        </div>
        <div>
          <label htmlFor="branch" className="mb-2 block text-sm font-medium text-slate-300">
            Branch
          </label>
          <input
            id="branch"
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="e.g. Computer Engineering"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="year" className="mb-2 block text-sm font-medium text-slate-300">
            Academic Year
          </label>
          <input
            id="year"
            type="text"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            placeholder="e.g. 2025"
          />
        </div>
        <div>
          <label htmlFor="session" className="mb-2 block text-sm font-medium text-slate-300">
            Session
          </label>
          <select
            id="session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
          >
            <option value="Winter">Winter</option>
            <option value="Summer">Summer</option>
          </select>
          <p className="mt-2 text-xs text-slate-500">
            Winter: CO1K, CO3K, CO5K — Summer: CO2K, CO4K, CO6K
          </p>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Upload Workbook (.xlsx)</label>
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 cursor-pointer ${
            dragActive
              ? "border-indigo-500/60 bg-indigo-500/[0.06] shadow-[0_0_30px_rgba(99,102,241,0.1)]"
              : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03]"
          }`}
        >
          <input
            type="file"
            accept={ACCEPT}
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="workbook-file"
            style={{ background: 'transparent', border: 'none' }}
          />
          <div className="flex flex-col items-center gap-3">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              dragActive ? 'bg-indigo-500/20 scale-110' : 'bg-white/[0.04]'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors duration-300 ${dragActive ? 'text-indigo-400' : 'text-slate-500'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            {file ? (
              <div>
                <span className="font-semibold text-indigo-300">{file.name}</span>
                <p className="mt-1 text-xs text-slate-500">Click or drag to replace</p>
              </div>
            ) : (
              <div>
                <span className="font-medium text-slate-300">Drag & drop or click to select</span>
                <p className="mt-1 text-xs text-slate-500">.xlsx files only</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sheet detection preview */}
      {detectedSheets && (
        <div className="glass-tile animate-slide-up">
          <h3 className="mb-3 text-sm font-semibold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            Detected Sheets
          </h3>
          <ul className="space-y-2">
            {detectedSheets.expected?.map((name) => {
              const found = detectedSheets.found?.includes(name);
              return (
                <li key={name} className="flex items-center gap-3 text-sm">
                  {found ? (
                    <span className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  ) : (
                    <span className="h-5 w-5 rounded-full bg-rose-500/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                  <span className={found ? "text-white" : "text-slate-500"}>{name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Error / Success alerts */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/[0.08] px-4 py-3 text-sm text-rose-300 animate-slide-up">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-3 text-sm text-emerald-300 animate-slide-up">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-glass btn-primary-glass disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Parsing…
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Upload & Parse
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setFile(null);
            setError("");
            setSuccess("");
            setDetectedSheets(null);
          }}
          className="btn-glass btn-secondary-glass"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
