"use client";

import UploadForm from "@/components/UploadForm";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      {/* Page header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-indigo-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Upload Result Workbook</h1>
          <p className="text-sm text-slate-400">
            Upload MSBTE-style workbooks. Winter: CO1K, CO3K, CO5K — Summer: CO2K, CO4K, CO6K.
          </p>
        </div>
      </div>
      <div className="glass-card">
        <UploadForm />
      </div>
    </div>
  );
}
