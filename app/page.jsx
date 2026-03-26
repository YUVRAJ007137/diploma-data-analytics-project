import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-4xl animate-fade-in">
      {/* Hero card */}
      <div className="glass-card relative overflow-hidden">
        {/* Background orbs */}
        <div className="orb w-64 h-64 bg-indigo-600 -top-20 -right-20" />
        <div className="orb w-48 h-48 bg-cyan-500 -bottom-16 -left-16" style={{ animationDelay: '2s' }} />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 mb-4">
                <span className="h-2 w-2 rounded-full bg-indigo-400 glow-dot" style={{ color: '#6366F1' }} />
                <span className="text-xs font-semibold text-indigo-300 tracking-wide uppercase">Analytics Platform</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
                <span className="text-gradient">Diploma Result</span>
                <br />
                <span className="text-white">Analytics Platform</span>
              </h2>
              <p className="mt-4 text-lg text-slate-400 max-w-xl leading-relaxed">
                Upload MSBTE-style workbooks, generate semester-wise insights, and compare branch performance across academic years.
              </p>
            </div>
            <div className="hidden sm:block flex-shrink-0">
              <div className="relative">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-float">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="3" width="20" height="14" rx="2" fill="white" fillOpacity="0.2" />
                    <path d="M7 14l3-3 2 2 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="7" cy="14" r="1.5" fill="white" fillOpacity="0.6" />
                    <circle cx="10" cy="11" r="1.5" fill="white" fillOpacity="0.6" />
                    <circle cx="12" cy="13" r="1.5" fill="white" fillOpacity="0.6" />
                    <circle cx="17" cy="9" r="1.5" fill="white" fillOpacity="0.6" />
                  </svg>
                </div>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-float" style={{ animationDelay: '1s' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="glass-tile flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Easy Upload</p>
                <p className="text-xs text-slate-500">Drag & drop .xlsx</p>
              </div>
            </div>
            <div className="glass-tile flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Rich Analytics</p>
                <p className="text-xs text-slate-500">Charts & insights</p>
              </div>
            </div>
            <div className="glass-tile flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Compare Years</p>
                <p className="text-xs text-slate-500">Side-by-side analysis</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/upload"
              className="btn-glass btn-primary-glass text-base px-8 py-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Start Upload
            </Link>
            <Link
              href="/dashboard"
              className="btn-glass btn-secondary-glass text-base px-8 py-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
              Open Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
