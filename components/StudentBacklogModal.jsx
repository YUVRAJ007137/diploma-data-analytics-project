"use client";

import React from "react";

export default function StudentBacklogModal({ student, onClose }) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl animate-slide-up">
        <div className="glass-card border-white/[0.08]" style={{ background: 'linear-gradient(135deg, rgba(15,15,25,0.95), rgba(10,10,18,0.98))' }}>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="avatar h-12 w-12 bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 text-indigo-300 text-base border border-indigo-500/20">
                {(student.studentName && student.studentName.split(' ').map(p => p[0]).slice(0, 2).join('')) || '?'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{student.studentName || student.enrollmentNumber || student.key}</h3>
                <div className="mt-0.5 text-sm text-slate-400">
                  {student.enrollmentNumber ? `EN: ${student.enrollmentNumber}` : student.seatNumber ? `Seat: ${student.seatNumber}` : null}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Semester details */}
          <div className="mt-6">
            <h4 className="mb-3 text-sm font-semibold text-slate-300 uppercase tracking-wider">Semester Backlog Details</h4>
            <div className="space-y-2">
              {student.semesterBacks && student.semesterBacks.length > 0 ? (
                student.semesterBacks.map((b) => (
                  <div key={b.semester} className="glass-tile flex items-center justify-between">
                    <span className="font-medium text-white text-sm">{b.semester}</span>
                    <span className={`badge ${b.backCount > 0 ? 'badge-red' : 'badge-emerald'}`}>
                      {b.backCount} {b.backCount === 1 ? 'back' : 'backs'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500 py-2">No semester backlog data available.</div>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 flex items-center justify-between glass-tile bg-gradient-to-r from-rose-500/10 to-transparent border-rose-500/20">
            <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Total Backlogs</span>
            <span className="text-3xl font-bold text-rose-400">{student.totalBacks}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
