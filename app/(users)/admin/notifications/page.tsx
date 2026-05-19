"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, CheckCheck, Trash2, User, FileText, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchInput from "@/components/admin/SearchInput";
import FilterTabs from "@/components/admin/FilterTabs";
import EmptyState from "@/components/admin/EmptyState";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationAction,
  clearAllNotifications,
} from "@/server/adminActions";

interface Notification {
  _id: string;
  type: "user" | "contact";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const iconMap = {
  user: User,
  contact: FileText,
};

const colorMap = {
  user: "bg-primary/10 text-primary",
  contact: "bg-secondary/10 text-secondary",
};

const tabs = ["All", "Unread", "Users", "contact"];

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      if (res.success && res.notifications) {
        setNotifications(res.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const filtered = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "Unread") return matchesSearch && !n.read;
    if (activeTab === "Users") return matchesSearch && n.type === "user";
    if (activeTab === "contact") return matchesSearch && n.type === "contact";
    return matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    await markNotificationAsRead(id);
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsAsRead();
  };

  const deleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    await deleteNotificationAction(id);
  };

  const clearAll = async () => {
    setNotifications([]);
    await clearAllNotifications();
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-8 w-48 bg-muted rounded-xl animate-pulse" />
            <div className="h-4 w-64 bg-muted/60 rounded-lg mt-2 animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-32 bg-muted rounded-xl animate-pulse" />
            <div className="h-9 w-28 bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-full bg-muted rounded-xl animate-pulse" />
        <div className="h-10 w-64 bg-muted rounded-xl animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted/40 rounded-2xl border border-border/20 flex p-4 gap-4">
              <div className="w-10 h-10 bg-muted rounded-xl shrink-0 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">Stay updated with platform activity</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="rounded-xl"
          >
            <CheckCheck className="w-4 h-4 mr-1" /> Mark all read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="rounded-xl text-destructive hover:text-destructive"
          >
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
                  key={n._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card
                    className={`rounded-2xl border-border/50 transition-colors ${
                      !n.read ? "bg-primary/[0.03] border-primary/20" : ""
                    }`}
                  >
                    <CardContent className="flex items-start gap-4 p-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          colorMap[n.type]
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-medium ${
                              !n.read ? "text-foreground font-semibold" : "text-foreground"
                            }`}
                          >
                            {n.title}
                          </p>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          {formatTime(n.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!n.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => markAsRead(n._id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                          onClick={() => deleteNotification(n._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up! No notifications match your filters."
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminNotifications;
