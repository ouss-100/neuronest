"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

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
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r transition-all ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-5 flex justify-between">
          {!collapsed && <span className="font-bold">{role}</span>}

          <button onClick={() => setCollapsed(!collapsed)}>
            <ChevronLeft
              className={`transition ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
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
              <item.icon className="w-5 h-5" />
              {!collapsed && item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => router.push("/login")}
          className="p-4 flex gap-2 text-muted-foreground"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && "Logout"}
        </button>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center px-4 lg:hidden">
          <button onClick={() => setMobileOpen(true)}>
            <Menu />
          </button>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
