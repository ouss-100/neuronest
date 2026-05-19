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
  Bell,
  Sun,
  Moon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [darkMode, setDarkMode] = useState(false);

  const roleLabels = {
    parent: "Parent",
    doctor: "Doctor",
    admin: "Admin",
  };

  const user = {
    name: "Oussama",
    email: "oussama@email.com",
    initials: "OU",
  };

  const mockNotifications = [
    { id: 1, text: "New appointment booked", time: "2 min ago", unread: true },
    { id: 2, text: "Report is ready", time: "10 min ago", unread: false },
  ];

  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  const navigate = (path: string) => router.push(path);

  const handleResize = (e: MouseEvent) => {
    const newWidth = e.clientX;
    if (newWidth >= 100 && newWidth <= 400) {
      setSidebarWidth(newWidth);
      setCollapsed(newWidth < 120);
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
      { label: "Dashboard", icon: LayoutDashboard, to: "/doctor" },
      { label: "Evaluations", icon: ClipboardList, to: "/doctor/evaluation" },
      { label: "Reports", icon: FileText, to: "/doctor/reports" },
      { label: "Appointments", icon: Calendar, to: "/doctor/appointments" },
    ],
    admin: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
      { label: "Users", icon: Users, to: "/admin/users" },
      { label: "Notifications", icon: Bell, to: "/admin/notifications" },
      { label: "Reports", icon: BarChart3, to: "/admin/reports" },
    ],
  };

  const links = navConfig[role];
  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className="hidden lg:flex flex-col border-r h-screen relative"
        style={{ width: collapsed ? 64 : sidebarWidth }}
      >
        <div className="p-5 flex justify-between items-center border-b">
          {!collapsed && <span className="font-bold capitalize">{role}</span>}
          <button onClick={() => setCollapsed(!collapsed)}>
            <ChevronLeft
              className={`transition ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

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
              <item.icon className="w-5 h-5" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t">
          <button
            onClick={() => router.push("/login")}
            className="w-full p-4 flex gap-2 text-muted-foreground hover:bg-muted"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && "Logout"}
          </button>
        </div>

        <div
          className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-primary/20"
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
            className="fixed inset-0 z-50 bg-background lg:hidden flex flex-col w-64 border-r"
          >
            <div className="p-5 flex justify-between items-center border-b">
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
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 lg:px-8 border-b bg-card/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm lg:hidden">
              {roleLabels[role]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications - FIXED: Removed nested button */}
            <Popover>
              <PopoverTrigger className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </PopoverTrigger>
              <PopoverContent className="w-80">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="p-2 border-b last:border-0">
                    <p className="text-sm font-medium">{n.text}</p>
                    <small className="text-xs text-muted-foreground">
                      {n.time}
                    </small>
                  </div>
                ))}
              </PopoverContent>
            </Popover>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(`/${role}`)}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/${role}/settings`)}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/login")}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
