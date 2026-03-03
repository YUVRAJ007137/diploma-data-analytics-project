import { Inter } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata = {
  title: "Diploma Data Analysis Dashboard",
  description: "Upload CO1K, CO3K, CO5K Excel files and view analysis.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        <DataProvider>
          <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
              <Link href="/" className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Diploma Data Analysis
              </Link>
              <nav className="flex gap-4">
                <Link
                  href="/upload"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Upload
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Dashboard
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
        </DataProvider>
      </body>
    </html>
  );
}
