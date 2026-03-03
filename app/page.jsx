import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
        Diploma Data Analysis Dashboard
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        Upload CO1K, CO3K, and CO5K Excel result files to view semester-wise analysis,
        pass/fail statistics, subject averages, top performers, and ATKT lists.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href="/upload"
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          Upload files
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
