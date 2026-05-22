"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Cpu,
  MapPin,
  Users,
  BookOpen,
  Star,
  LogOut,
  Zap,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { useState, useEffect, useCallback, useEffectEvent } from "react";

const links = [
  { href: "/dashboard",      label: "Dashboard",       icon: LayoutDashboard },
  { href: "/brands",         label: "Vehicle Brands",  icon: Car },
  { href: "/models",         label: "Vehicle Models",  icon: Cpu },
  { href: "/stations",       label: "Stations",        icon: MapPin },
  { href: "/users",          label: "Users",           icon: Users },
  { href: "/bookings",       label: "Bookings",        icon: BookOpen },
  { href: "/reviews",        label: "Reviews",         icon: Star },
  { href: "/settings",       label: "Settings",        icon: Settings },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dark = theme === "dark";

  // Sidebar colors based on theme
  const sidebarBg = dark ? "bg-gray-900" : "bg-white";
  const sidebarText = dark ? "text-white" : "text-[#1E2A3A]";
  const borderColor = dark ? "border-gray-700" : "border-gray-200";
  const navInactive = dark ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-[#1E2A3A]";
  const hoverBg = dark ? "hover:bg-gray-800" : "hover:bg-gray-100";

  const closeDrawer = useEffectEvent(() => {
    setOpen(false);
  });

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (!open) return;
    closeDrawer();
  }, [path, open]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    router.replace("/login");
  }, [router]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-2 px-6 py-5 border-b ${borderColor} shrink-0`}>
        <Zap className="text-[#00C950]" size={24} />
        <span className="text-lg font-bold">EV Charging</span>
        <span className="ml-auto text-xs bg-[#00C950] text-white px-2 py-0.5 rounded">Admin</span>
        {/* Close button - mobile only */}
        <button
          onClick={() => setOpen(false)}
          className={`lg:hidden ml-2 p-1 rounded-lg ${hoverBg} text-gray-400 transition-colors`}
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#00C950] text-white"
                  : navInactive
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="px-3 pb-2 shrink-0">
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${navInactive}`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Logout */}
      <div className="px-3 pb-5 shrink-0">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── Mobile top bar with hamburger ── */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-40 ${sidebarBg} border-b ${borderColor} flex items-center gap-3 px-4 py-3`}>
        <button
          onClick={() => setOpen(true)}
          className={`p-1.5 rounded-lg ${hoverBg} text-gray-400 transition-colors`}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <Zap className="text-[#00C950]" size={20} />
        <span className={`font-bold text-sm ${sidebarText}`}>EV Charging</span>
        <span className="text-xs bg-[#00C950] text-white px-2 py-0.5 rounded ml-auto">Admin</span>
      </div>

      {/* ── Mobile/Tablet overlay backdrop ── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar drawer (mobile/tablet) ── */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 ${sidebarBg} ${sidebarText} flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* ── Sidebar fixed (desktop) ── */}
      <aside className={`hidden lg:flex w-64 shrink-0 h-screen fixed top-0 left-0 ${sidebarBg} ${sidebarText} flex-col z-30 border-r ${borderColor}`}>
        {sidebarContent}
      </aside>
      {/* Spacer to offset fixed sidebar */}
      <div className="hidden lg:block w-64 shrink-0" />
    </>
  );
}
