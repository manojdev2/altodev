"use client";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { Users, MapPin, BookOpen, Star, Car, Zap } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { PageLoader } from "@/components/PageLoader";

interface Stats {
  totalUsers: number; totalBookings: number; totalStations: number;
  totalSessions: number; totalReviews: number; totalBrands: number; totalRevenue: number;
}

const cards = [
  { key: "totalUsers",    label: "Users",     icon: Users,    color: "bg-blue-500" },
  { key: "totalBookings", label: "Bookings",  icon: BookOpen, color: "bg-purple-500" },
  { key: "totalStations", label: "Stations",  icon: MapPin,   color: "bg-green-500" },
  { key: "totalSessions", label: "Sessions",  icon: Zap,      color: "bg-yellow-500" },
  { key: "totalReviews",  label: "Reviews",   icon: Star,     color: "bg-pink-500" },
  { key: "totalBrands",   label: "Brands",    icon: Car,      color: "bg-orange-500" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const dark = theme === "dark";

  const fetchStats = useCallback(async () => {
    try {
      const r = await api.get("/admin/dashboard");
      setStats(r.data.data);
      setError(null);
    } catch {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setBootstrapped(true);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (!bootstrapped) {
    return <PageLoader label="Loading dashboard" fullscreen />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-gray-500">{error}</p>
        <button
          onClick={() => {
            setBootstrapped(false);
            fetchStats();
          }}
          className="px-4 py-2 rounded-lg bg-[#00C950] text-white text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {cards.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className={`rounded-xl shadow-sm p-4 sm:p-5 flex items-center gap-3 sm:gap-4 transition-colors ${dark ? "bg-[#1E2A3A]" : "bg-white"}`}>
            <div className={`${color} text-white p-2.5 sm:p-3 rounded-lg`}>
              <Icon size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{stats ? (stats as never)[key] : "—"}</p>
              <p className={`text-xs sm:text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
            </div>
          </div>
        ))}
        {/* Revenue card */}
        <div className={`rounded-xl shadow-sm p-4 sm:p-5 flex items-center gap-3 sm:gap-4 sm:col-span-2 transition-colors ${dark ? "bg-[#1E2A3A]" : "bg-white"}`}>
          <div className="bg-teal-500 text-white p-2.5 sm:p-3 rounded-lg">
            <Zap size={20} className="sm:w-[22px] sm:h-[22px]" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold">${stats?.totalRevenue?.toFixed(2) ?? "—"}</p>
            <p className={`text-xs sm:text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>Total Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
