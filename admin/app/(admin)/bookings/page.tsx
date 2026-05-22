"use client";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { useTheme } from "@/lib/ThemeContext";
import { PageLoader } from "@/components/PageLoader";

interface Booking {
  _id: string; stationName: string; vehicleName: string;
  date: string; time: string; totalAmount: number;
  isPaid: boolean; status: string; createdAt: string;
}

const statusColor: Record<string, string> = {
  Upcoming:  "bg-yellow-100 text-yellow-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const { theme } = useTheme();
  const dark = theme === "dark";

  const fetchBookings = useCallback(async () => {
    setTableLoading(true);
    try {
      const r = await api.get("/admin/bookings");
      const data = r.data?.data;
      setBookings(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setError("Failed to load bookings. Please refresh.");
    } finally {
      setTableLoading(false);
      setBootstrapped(true);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  if (!bootstrapped) {
    return <PageLoader label="Loading bookings" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Bookings</h1>
        <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-400"}`}>{bookings.length} total</span>
      </div>

      <div className={`rounded-xl shadow-sm overflow-hidden transition-colors ${dark ? "bg-[#1E2A3A]" : "bg-white"}`}>
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className={`border-b ${dark ? "bg-[#1A2332] border-[#2d3a4a]" : "bg-gray-50 border-gray-200"}`}>
            <tr>
              {["Station","Vehicle","Date","Time","Amount","Paid","Status","Created"].map(h => (
                <th key={h} className={`text-left px-4 py-3 font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableLoading && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
            )}
            {!tableLoading && error && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-red-400">{error}</td></tr>
            )}
            {!tableLoading && !error && bookings.map(b => (
              <tr key={b._id} className={`border-b last:border-0 transition-colors ${dark ? "border-[#2d3a4a] hover:bg-[#253347]" : "hover:bg-gray-50"}`}>
                <td className="px-4 py-3 font-medium">{b.stationName || "—"}</td>
                <td className={`px-4 py-3 ${dark ? "text-gray-300" : "text-gray-600"}`}>{b.vehicleName || "—"}</td>
                <td className={`px-4 py-3 ${dark ? "text-gray-400" : "text-gray-500"}`}>{b.date || "—"}</td>
                <td className={`px-4 py-3 ${dark ? "text-gray-400" : "text-gray-500"}`}>{b.time || "—"}</td>
                <td className="px-4 py-3 font-medium">${(b.totalAmount || 0).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.isPaid ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {b.isPaid ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[b.status] || "bg-gray-100 text-gray-500"}`}>
                    {b.status || "—"}
                  </span>
                </td>
                <td className={`px-4 py-3 ${dark ? "text-gray-500" : "text-gray-400"}`}>{new Date(b.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {!tableLoading && !error && bookings.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No bookings yet.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
