"use client";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { PageLoader } from "@/components/PageLoader";

interface User {
  _id: string; fullName: string; email: string; phone: string;
  isVerified: boolean; authProvider: string; createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers]     = useState<User[]>([]);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const { theme } = useTheme();
  const dark = theme === "dark";

  const loadUsers = useCallback(async () => {
    setTableLoading(true);
    try {
      const r = await api.get("/admin/users");
      setUsers(r.data.data);
    } catch {
      toast.error("Failed to load users.");
    } finally {
      setTableLoading(false);
      setBootstrapped(true);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const del = async (id: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted.");
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch {
      toast.error("Failed to delete user. Try again.");
    }
  };

  if (!bootstrapped) {
    return <PageLoader label="Loading users" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Users</h1>
        <span className="text-sm text-gray-400">{users.length} total</span>
      </div>

      <div className={`rounded-xl shadow-sm overflow-hidden transition-colors ${dark ? "bg-[#1E2A3A]" : "bg-white"}`}>
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[650px]">
          <thead className={`border-b ${dark ? "bg-[#1A2332] border-[#2d3a4a]" : "bg-gray-50 border-gray-200"}`}>
            <tr>
              {["Name","Email","Phone","Provider","Verified","Joined","Action"].map((h, i) => (
                <th key={h} className={`${i === 6 ? "text-right" : "text-left"} px-4 py-3 font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableLoading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
            )}
            {!tableLoading && users.map(u => (
              <tr key={u._id} className={`border-b last:border-0 transition-colors ${dark ? "border-[#2d3a4a] hover:bg-[#253347]" : "hover:bg-gray-50"}`}>
                <td className="px-4 py-3 font-medium">{u.fullName || "—"}</td>
                <td className={`px-4 py-3 ${dark ? "text-gray-300" : "text-gray-600"}`}>{u.email}</td>
                <td className={`px-4 py-3 ${dark ? "text-gray-400" : "text-gray-500"}`}>{u.phone || "—"}</td>
                <td className="px-4 py-3 capitalize">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600 font-medium">{u.authProvider || "email"}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-600"}`}>
                    {u.isVerified ? "Yes" : "No"}
                  </span>
                </td>
                <td className={`px-4 py-3 ${dark ? "text-gray-500" : "text-gray-400"}`}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => del(u._id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {!tableLoading && users.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No users found.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
