import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-4xl">
      <div className="glass-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Diploma Result Analytics Platform</h2>
            <p className="mt-3 text-slate-600">Upload MSBTE-style workbooks, generate semester-wise insights, and compare branch performance across academic years.</p>
          </div>
          <div className="hidden sm:block">
            <svg width="84" height="84" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
              <rect x="2" y="3" width="20" height="14" rx="2" fill="url(#g)" />
              <path d="M7 14l3-3 2 2 5-5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href="/upload" className="btn btn-lg btn-primary d-block text-white">
            Start Upload
          </Link>
          <Link href="/dashboard" className="btn btn-lg btn-outline-secondary d-block">
            Open Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
