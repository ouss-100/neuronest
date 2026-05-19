"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, CheckCheck, Trash2, User, FileText, AlertTriangle, Shield, Clock, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchInput from "@/components/admin/SearchInput";
import FilterTabs from "@/components/admin/FilterTabs";
import EmptyState from "@/components/admin/EmptyState";

interface Notification {
  id: string;
  type: "user" | "report" | "alert" | "security" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const iconMap = {
  user: User,
  report: FileText,
  alert: AlertTriangle,
  security: Shield,
  system: Clock,
};

const colorMap = {
  user: "bg-primary/10 text-primary",
  report: "bg-secondary/10 text-secondary",
  alert: "bg-destructive/10 text-destructive",
  security: "bg-accent/10 text-accent",
  system: "bg-muted text-muted-foreground",
};

const initialNotifications: Notification[] = [
  { id: "1", type: "user", title: "New User Registration", message: "Dr. Sarah Johnson has registered as a doctor and is awaiting approval.", time: "2 minutes ago", read: false },
  { id: "2", type: "alert", title: "Low Assessment Score", message: "Child Ahmed (ID: C-1042) scored below threshold on cognitive assessment.", time: "15 minutes ago", read: false },
  { id: "3", type: "security", title: "Failed Login Attempts", message: "5 failed login attempts detected from IP 192.168.1.45.", time: "1 hour ago", read: false },
  { id: "4", type: "report", title: "Weekly Report Ready", message: "The weekly platform analytics report has been generated.", time: "3 hours ago", read: true },
  { id: "5", type: "user", title: "Doctor Verification", message: "Dr. Michael Brown uploaded new credentials for verification.", time: "5 hours ago", read: true },
  { id: "6", type: "system", title: "Backup Completed", message: "Daily database backup completed successfully at 3:00 AM.", time: "8 hours ago", read: true },
  { id: "7", type: "alert", title: "High Traffic Detected", message: "Unusual spike in assessment submissions detected in the last hour.", time: "1 day ago", read: true },
  { id: "8", type: "security", title: "Permission Change", message: "Admin role was granted to user admin2@learnbright.com.", time: "2 days ago", read: true },
];

const tabs = ["All", "Unread", "Users", "Reports", "Alerts", "Security"];

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filtered = notifications.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "Unread") return matchesSearch && !n.read;
    if (activeTab === "Users") return matchesSearch && n.type === "user";
    if (activeTab === "Reports") return matchesSearch && n.type === "report";
    if (activeTab === "Alerts") return matchesSearch && n.type === "alert";
    if (activeTab === "Security") return matchesSearch && n.type === "security";
    return matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">{unreadCount} new</Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">Stay updated with platform activity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0} className="rounded-xl">
            <CheckCheck className="w-4 h-4 mr-1" /> Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll} disabled={notifications.length === 0} className="rounded-xl text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-1" /> Clear all
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput placeholder="Search notifications..." value={search} onChange={setSearch} />
      </div>

      <FilterTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((n) => {
              const Icon = iconMap[n.type];
              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className={`rounded-2xl border-border/50 transition-colors ${!n.read ? "bg-primary/[0.03] border-primary/20" : ""}`}>
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[n.type]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium ${!n.read ? "text-foreground font-semibold" : "text-foreground"}`}>{n.title}</p>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!n.read && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => markAsRead(n.id)}>
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive" onClick={() => deleteNotification(n.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <EmptyState icon={Bell} title="No notifications" description="You're all caught up! No notifications match your filters." />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminNotifications;
