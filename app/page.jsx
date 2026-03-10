import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-3xl font-bold text-brand">Diploma Result Analytics Platform</h2>
      <p className="mt-3 text-slate-600">
        Upload MSBTE-style workbooks, generate semester-wise insights, and compare branch performance across academic years.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link href="/upload" className="rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white">
          Start Upload
        </Link>
        <Link href="/dashboard" className="rounded-lg border border-slate-300 px-4 py-3 text-center font-semibold text-slate-700">
          Open Dashboard
        </Link>
      </div>
    </section>
  );
}
