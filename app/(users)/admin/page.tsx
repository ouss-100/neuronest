"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ClipboardList,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Loader2,
  Activity,
} from "lucide-react";
import StatCard from "@/components/StatCard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAdminDashboardData } from "@/server/adminActions";

const COLORS = [
  "hsl(205,80%,45%)",
  "hsl(170,60%,42%)",
  "hsl(38,92%,50%)",
  "hsl(0,72%,55%)",
];

const formatTime = (dateStr: string) => {
  if (!dateStr) return "Unknown";
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

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAdminDashboardData();
      if (res.success) {
        setData(res.data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const roleData = [
    { name: "Doctors", value: data?.totalDoctors || 0 },
    { name: "Parents", value: data?.totalParents || 0 },
  ];

  const statusData = [
    { name: "Confirmed", value: data?.appointmentsConfirmed || 0 },
    { name: "Pending", value: data?.appointmentsPending || 0 },
    { name: "Cancelled", value: data?.appointmentsCancelled || 0 },
  ];

  const monthlyGrowth = data?.monthlyGrowth || [];
  const recentNotifications = data?.recentNotifications || [];
  const topAssessments = data?.topAssessments || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Platform overview and analytics
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-xl px-4 py-2">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date().toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={data?.totalUsers?.toString() || "0"}
          change="Real-time"
          color="primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Active Doctors"
          value={data?.activeDoctors?.toString() || "0"}
          change="Real-time"
          color="primary"
        />
        <StatCard
          icon={ClipboardList}
          label="Appointments"
          value={data?.totalAppointments?.toString() || "0"}
          change="Real-time"
          color="secondary"
        />
        <StatCard
          icon={BarChart3}
          label="Reports"
          value={data?.totalReports?.toString() || "0"}
          change="Real-time"
          color="accent"
        />
      </div>

      <Card className="rounded-[32px] border-border/50 shadow-[var(--shadow-soft)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">User & Assessment Growth</CardTitle>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary inline-block" />{" "}
                Users
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-secondary inline-block" />{" "}
                Assessments
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-56 flex items-end gap-3 px-2">
            {monthlyGrowth.map((m: any, i: number) => (
              <div
                key={m.month}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full flex gap-0.5 items-end"
                  style={{ height: "100%" }}
                >
                  <motion.div
                    className="flex-1 bg-primary rounded-t-lg"
                    initial={{ height: 0 }}
                    animate={{ height: `${m.users}%` }}
                    transition={{
                      delay: i * 0.04,
                      duration: 0.6,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                  />
                  <motion.div
                    className="flex-1 bg-secondary rounded-t-lg"
                    initial={{ height: 0 }}
                    animate={{ height: `${m.assessments}%` }}
                    transition={{
                      delay: i * 0.04 + 0.1,
                      duration: 0.6,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {m.month}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Appointments by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="hsl(205,80%,45%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Users by Role</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {roleData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Top Assessments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topAssessments.map((item: any, i: number) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">
                    {item.name}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {item.count}
                  </span>
                </div>
                <div className="progress-track !h-2">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Assessments Over Time
            </CardTitle>
            <span className="flex items-center gap-1 text-xs font-semibold text-secondary">
              <ArrowUpRight className="w-3 h-3" /> +18% growth
            </span>
          </CardHeader>
          <CardContent>
            <div className="h-52 flex items-end gap-2 px-2">
              {monthlyGrowth.map((m: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${m.assessments}%` }}
                    transition={{
                      delay: i * 0.05,
                      duration: 0.6,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    className="w-full rounded-t-xl bg-primary/15 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-xl"
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ delay: i * 0.05 + 0.3, duration: 0.5 }}
                    />
                  </motion.div>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {m.month}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-3">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((n: any, i: number) => (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex gap-3 items-start p-3 rounded-2xl hover:bg-muted/40 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.read ? 'bg-muted-foreground/30' : 'bg-primary'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${!n.read ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>{n.title}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{formatTime(n.createdAt)}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
