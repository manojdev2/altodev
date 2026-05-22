"use client";
import Sidebar from "@/components/Sidebar";
import { PageLoader } from "@/components/PageLoader";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { useTheme } from "@/lib/ThemeContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { checking } = useAdminAuth();
  const { theme } = useTheme();

  if (checking) {
    return (
      <div
        className="min-h-screen"
        style={{
          backgroundColor: theme === "dark" ? "#101828" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#1E2A3A",
        }}
      >
        <PageLoader label="Checking session…" fullscreen />
      </div>
    );
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto transition-colors duration-200 pt-16 lg:pt-8"
        style={{
          backgroundColor: theme === "dark" ? "#101828" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#1E2A3A",
        }}
      >
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
