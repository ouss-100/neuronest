"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Baby,
  ClipboardList,
  Stethoscope,
  Calendar,
  BookOpen,
  ChevronLeft,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Role = "parent" | "doctor" | "admin";

export default function DashboardClient({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256); // 256px = 64 (w-64)

  // Handle sidebar resize
  const handleResize = (e: MouseEvent) => {
    const newWidth = e.clientX;
    if (newWidth >= 100 && newWidth <= 400) {
      setSidebarWidth(newWidth);
      if (newWidth < 120) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    }
  };

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", stopResizing);
  };

  const stopResizing = () => {
    window.removeEventListener("mousemove", handleResize);
    window.removeEventListener("mouseup", stopResizing);
  };

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, []);

  const navConfig = {
    parent: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/parent" },
      { label: "Children", icon: Baby, to: "/parent/child-profile" },
      { label: "Assessment", icon: ClipboardList, to: "/parent/assessment" },
      { label: "Results", icon: BarChart3, to: "/parent/results" },
      {
        label: "Doctor Notes",
        icon: Stethoscope,
        to: "/parent/recommendations",
      },
    ],
    doctor: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/doctor/dashboard" },
      { label: "Evaluations", icon: ClipboardList, to: "/doctor/evaluation" },
      { label: "Reports", icon: FileText, to: "/doctor/reports" },
      { label: "Appointments", icon: Calendar, to: "/doctor/appointments" },
    ],
    admin: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
      { label: "Users", icon: Users, to: "/admin/users" },
      { label: "Content", icon: BookOpen, to: "/admin/content" },
      { label: "Reports", icon: BarChart3, to: "/admin/reports" },
      { label: "Settings", icon: Settings, to: "/admin/settings" },
    ],
  };

  const links = navConfig[role];
  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar - Fixed height, scrollable content */}
      <aside
        className="hidden lg:flex flex-col border-r h-screen relative"
        style={{ width: collapsed ? 64 : sidebarWidth }}
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-5 flex justify-between items-center border-b">
          {!collapsed && <span className="font-bold capitalize">{role}</span>}
          <button onClick={() => setCollapsed(!collapsed)}>
            <ChevronLeft
              className={`transition ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {links.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
                isActive(item.to)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 border-t">
          <button
            onClick={() => router.push("/login")}
            className="w-full p-4 flex gap-2 text-muted-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && "Logout"}
          </button>
        </div>

        {/* Resize Handle */}
        <div
          className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-primary/20 active:bg-primary/40 transition-colors"
          onMouseDown={startResizing}
        />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed inset-0 z-50 bg-background lg:hidden flex flex-col w-64 border-r h-screen"
          >
            <div className="flex-shrink-0 p-5 flex justify-between items-center border-b">
              <span className="font-bold capitalize">{role}</span>
              <button onClick={() => setMobileOpen(false)}>
                <X />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {links.map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
                    isActive(item.to)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex-shrink-0 border-t">
              <button
                onClick={() => router.push("/login")}
                className="w-full p-4 flex gap-2 text-muted-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Fixed header, scrollable content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header - Fixed */}
        <header className="flex-shrink-0 h-14 flex items-center px-4 lg:hidden border-b">
          <button onClick={() => setMobileOpen(true)}>
            <Menu />
          </button>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
