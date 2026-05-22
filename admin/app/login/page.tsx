"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Zap } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "admin@uvcharging.com", password: "Admin@1234" });
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const dark = theme === "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/admin/login", {
        email: form.email,
        password: form.password,
      });
      if (res.data.status === "Success") {
        localStorage.setItem("admin_token", res.data.token);
        localStorage.setItem("admin_user", JSON.stringify(res.data.data));
        toast.success("Welcome back!");
        router.replace("/dashboard");
      } else {
        toast.error(res.data.message || "Login failed.");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${dark ? "bg-[#101828]" : "bg-gray-900"}`}>
      <div className={`rounded-2xl shadow-xl w-full max-w-md p-8 ${dark ? "bg-[#1E2A3A] text-white" : "bg-white"}`}>
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-[#00C950] p-2 rounded-lg">
            <Zap className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">EV Charging</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-1">Sign In</h2>
        <p className={`text-sm mb-6 ${dark ? "text-gray-400" : "text-gray-500"}`}>Enter your admin credentials</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : ""}`}>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`}
              placeholder="admin@uvcharging.com"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${dark ? "text-gray-300" : ""}`}>Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C950] ${dark ? "bg-[#1A2332] border-[#2d3a4a] text-white" : "border-gray-200"}`}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00C950] hover:bg-[#00b347] text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          Default: admin@uvcharging.com / Admin@1234
        </p>
      </div>
    </div>
  );
}
