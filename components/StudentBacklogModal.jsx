"use client";

import React from "react";

export default function StudentBacklogModal({ student, onClose }) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{student.studentName || student.enrollmentNumber || student.key}</h3>
            <div className="mt-1 text-xs text-slate-500">{student.enrollmentNumber ? `EN: ${student.enrollmentNumber}` : student.seatNumber ? `Seat: ${student.seatNumber}` : null}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200"
          >
            Close
          </button>
        </div>

        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium text-slate-700">Semester backlog details</h4>
          <div className="space-y-2 text-sm text-slate-700">
            {student.semesterBacks && student.semesterBacks.length > 0 ? (
              student.semesterBacks.map((b) => (
                <div key={b.semester} className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 p-2">
                  <div className="font-medium">{b.semester}</div>
                  <div className="text-xs text-slate-600">Backs: {b.backCount}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">No semester backlog data available.</div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium text-slate-700">Total</h4>
          <div className="text-lg font-semibold text-rose-600">{student.totalBacks} backs</div>
        </div>
      </div>
    </div>
  );
}
