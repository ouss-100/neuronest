"use client";

import { motion } from "framer-motion";
import {
  Users,
  ClipboardList,
  BarChart3,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const recentActivity = [
  {
    text: "New parent registration: Ana Martinez",
    time: "1 hour ago",
    type: "user",
  },
  {
    text: "Assessment completed: Oliver Chen (Score: 82%)",
    time: "3 hours ago",
    type: "assessment",
  },
  {
    text: "Dr. Smith submitted evaluation for Emma Johnson",
    time: "5 hours ago",
    type: "doctor",
  },
  {
    text: "New article published: Early Signs of Dyslexia",
    time: "1 day ago",
    type: "content",
  },
  {
    text: "Parent Sarah J. requested doctor consultation",
    time: "1 day ago",
    type: "appointment",
  },
  {
    text: "Platform maintenance completed successfully",
    time: "2 days ago",
    type: "system",
  },
];

const topAssessments = [
  { name: "Full Screening", count: 1248, pct: 45 },
  { name: "Reading Assessment", count: 832, pct: 30 },
  { name: "ADHD Screening", count: 416, pct: 15 },
  { name: "Initial Screening", count: 278, pct: 10 },
];

const chartData = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const AdminDashboard = () => (
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
        <span>March 2026</span>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Users}
        label="Total Users"
        value="1,247"
        change="+12% this month"
        color="primary"
      />
      <StatCard
        icon={ClipboardList}
        label="Assessments"
        value="3,892"
        change="+8% this month"
        color="secondary"
      />
      <StatCard
        icon={BarChart3}
        label="Completion Rate"
        value="87%"
        color="accent"
      />
      <StatCard
        icon={TrendingUp}
        label="Active Doctors"
        value="24"
        change="+3 new"
        color="primary"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart */}
      <div className="lg:col-span-2 card-soft">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-lg text-foreground">
            Assessments Over Time
          </h2>
          <span className="flex items-center gap-1 text-xs font-semibold text-secondary">
            <ArrowUpRight className="w-3 h-3" /> +18% growth
          </span>
        </div>
        <div className="h-52 flex items-end gap-2 px-2">
          {chartData.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
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
                {months[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Assessments */}
      <div className="card-soft">
        <h2 className="font-heading font-bold text-lg text-foreground mb-5">
          Top Assessments
        </h2>
        <div className="space-y-4">
          {topAssessments.map((item, i) => (
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
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="card-soft">
      <h2 className="font-heading font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" /> Recent Activity
      </h2>
      <div className="space-y-1">
        {recentActivity.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex gap-3 items-start p-3 rounded-2xl hover:bg-muted/40 transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{a.text}</p>
              <p className="text-xs text-muted-foreground">{a.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default AdminDashboard;
