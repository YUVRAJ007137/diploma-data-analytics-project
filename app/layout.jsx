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
      <body className="bg-slate-50 text-slate-900">
        <DataProvider>
          <div className="min-h-screen lg:flex">
            <Sidebar />
            <main className="w-full p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
