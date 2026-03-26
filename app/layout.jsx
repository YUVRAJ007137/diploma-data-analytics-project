import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Diploma Result Analytics Platform",
  description: "MSBTE workbook analytics dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Bootstrap CSS CDN */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
      </head>
      <body className="bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
        <DataProvider>
          <div className="min-h-screen lg:flex">
            <Sidebar />
            <main className="w-full p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
