"use client";

import UploadForm from "@/components/UploadForm";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Upload Result Workbook</h1>
      <p className="mt-1 text-slate-600">
        Upload MSBTE-style workbooks. Winter: CO1K, CO3K, CO5K — Summer: CO2K, CO4K, CO6K.
      </p>
      <div className="mt-6 card">
        <UploadForm />
      </div>
    </div>
  );
}
