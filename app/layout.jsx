import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Diploma Result Analytics Platform",
  description: "MSBTE workbook analytics dashboard — Upload, analyze, and compare diploma results with stunning visualizations."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <DataProvider>
          <div className="min-h-screen lg:flex">
            <Sidebar />
            <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 xl:p-10">
              {children}
            </main>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
