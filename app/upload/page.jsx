"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import Link from "next/link";

const SEMESTER_KEYS = ["CO1K", "CO3K", "CO5K"];
const ALLOWED_EXTENSIONS = [".xlsx", ".xls"];

function validateFile(file, key) {
  if (!file) return null;
  const name = (file.name || "").toLowerCase();
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
  if (!ALLOWED_EXTENSIONS.includes(ext))
    return `Invalid format for ${key}. Use .xlsx or .xls`;
  return null;
}

export default function UploadPage() {
  const router = useRouter();
  const { setAllSemesterData } = useData();
  const [files, setFiles] = useState({ CO1K: null, CO3K: null, CO5K: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleFileChange = (key, e) => {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [key]: file }));
    const err = validateFile(file, key);
    setValidationErrors((prev) => ({ ...prev, [key]: err || null }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    SEMESTER_KEYS.forEach((k) => {
      const err = validateFile(files[k], k);
      if (err) errs[k] = err;
    });
    if (Object.keys(errs).length) {
      setValidationErrors(errs);
      return;
    }

    const hasAny = SEMESTER_KEYS.some((k) => files[k]);
    if (!hasAny) {
      setError("Please select at least one Excel file.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      SEMESTER_KEYS.forEach((k) => {
        if (files[k]) formData.append(k, files[k]);
      });
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error: ${res.status}`);
      }
      const data = await res.json();
      setAllSemesterData(data);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Upload Excel files
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Select CO1K, CO3K, and/or CO5K result files (.xlsx or .xls). Data will be
        parsed and shown on the dashboard.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {SEMESTER_KEYS.map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              {key}
            </label>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileChange(key, e)}
                className="block w-full rounded-lg border border-slate-300 bg-white text-sm file:mr-4 file:rounded-l file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:file:bg-blue-900/30 dark:file:text-blue-300"
              />
            </div>
            {validationErrors[key] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {validationErrors[key]}
              </p>
            )}
            {files[key] && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {files[key].name}
              </p>
            )}
          </div>
        ))}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {loading ? "Processing…" : "Upload & analyze"}
          </button>
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
