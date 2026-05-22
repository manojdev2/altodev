"use client";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { Star } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { PageLoader } from "@/components/PageLoader";

interface Review {
  _id: string; rating: number; description: string; createdAt: string;
  userId?: { email: string; fullName: string };
  stationId?: { name: string };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const { theme } = useTheme();
  const dark = theme === "dark";

  const fetchReviews = useCallback(async () => {
    setTableLoading(true);
    try {
      const r = await api.get("/admin/reviews");
      setReviews(r.data.data);
    } catch {
      // Swallow, toast already used globally elsewhere
    } finally {
      setTableLoading(false);
      setBootstrapped(true);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (!bootstrapped) {
    return <PageLoader label="Loading reviews" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Reviews</h1>
        <span className="text-sm text-gray-400">{reviews.length} total</span>
      </div>

      <div className={`rounded-xl shadow-sm overflow-hidden transition-colors ${dark ? "bg-[#1E2A3A]" : "bg-white"}`}>
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className={`border-b ${dark ? "bg-[#1A2332] border-[#2d3a4a]" : "bg-gray-50 border-gray-200"}`}>
            <tr>
              {["User","Station","Rating","Review","Date"].map(h => (
                <th key={h} className={`text-left px-4 py-3 font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableLoading && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
            )}
            {!tableLoading && reviews.map(r => (
              <tr key={r._id} className={`border-b last:border-0 transition-colors ${dark ? "border-[#2d3a4a] hover:bg-[#253347]" : "hover:bg-gray-50"}`}>
                <td className="px-4 py-3">
                  <div className="font-medium">{r.userId?.fullName || "—"}</div>
                  <div className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>{r.userId?.email || ""}</div>
                </td>
                <td className={`px-4 py-3 ${dark ? "text-gray-300" : "text-gray-600"}`}>{r.stationId?.name || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className={i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                    ))}
                    <span className={`ml-1 text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{r.rating}/5</span>
                  </div>
                </td>
                <td className={`px-4 py-3 max-w-[260px] truncate ${dark ? "text-gray-400" : "text-gray-500"}`}>{r.description || "—"}</td>
                <td className={`px-4 py-3 ${dark ? "text-gray-500" : "text-gray-400"}`}>{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {!tableLoading && reviews.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No reviews yet.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
