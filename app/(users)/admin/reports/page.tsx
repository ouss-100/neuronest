"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Clock, ArrowUpRight, Download } from "lucide-react";
import StatCard from "@/components/StatCard";

const monthlyGrowth = [
  { month: "Jan", users: 30, assessments: 45 },
  { month: "Feb", users: 45, assessments: 60 },
  { month: "Mar", users: 50, assessments: 55 },
  { month: "Apr", users: 65, assessments: 80 },
  { month: "May", users: 55, assessments: 70 },
  { month: "Jun", users: 80, assessments: 90 },
  { month: "Jul", users: 70, assessments: 75 },
  { month: "Aug", users: 85, assessments: 88 },
  { month: "Sep", users: 90, assessments: 95 },
  { month: "Oct", users: 78, assessments: 82 },
  { month: "Nov", users: 95, assessments: 98 },
  { month: "Dec", users: 88, assessments: 92 },
];

const assessmentTypes = [
  { label: "Full Screening", pct: 45, count: "1,248", color: "bg-primary" },
  { label: "Reading Assessment", pct: 30, count: "832", color: "bg-secondary" },
  { label: "ADHD Screening", pct: 15, count: "416", color: "bg-accent" },
  { label: "Initial Screening", pct: 10, count: "278", color: "bg-muted-foreground" },
];

const ageDistribution = [
  { label: "3–5 years", pct: 20 },
  { label: "6–8 years", pct: 40 },
  { label: "9–11 years", pct: 28 },
  { label: "12+ years", pct: 12 },
];

const AdminReports = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Platform usage statistics and assessment analytics</p>
      </div>
      <button className="btn-outline-primary !px-5 !py-2.5 text-sm flex items-center gap-2 w-fit">
        <Download className="w-4 h-4" /> Export Report
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Users} label="New Users" value="156" change="+23% vs last month" color="primary" />
      <StatCard icon={BarChart3} label="Assessments" value="482" change="+15% vs last month" color="secondary" />
      <StatCard icon={Clock} label="Avg. Duration" value="7.2 min" color="accent" />
      <StatCard icon={TrendingUp} label="Satisfaction" value="4.8/5" change="+0.3 this month" color="primary" />
    </div>

    {/* Dual bar chart */}
    <div className="card-soft">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-lg text-foreground">User & Assessment Growth</h2>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary inline-block" /> Users</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-secondary inline-block" /> Assessments</span>
        </div>
      </div>
      <div className="h-56 flex items-end gap-3 px-2">
        {monthlyGrowth.map((m, i) => (
          <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex gap-0.5 items-end" style={{ height: "100%" }}>
              <motion.div
                className="flex-1 bg-primary rounded-t-lg"
                initial={{ height: 0 }}
                animate={{ height: `${m.users}%` }}
                transition={{ delay: i * 0.04, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              />
              <motion.div
                className="flex-1 bg-secondary rounded-t-lg"
                initial={{ height: 0 }}
                animate={{ height: `${m.assessments}%` }}
                transition={{ delay: i * 0.04 + 0.1, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">{m.month}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Assessment Types */}
      <div className="card-soft">
        <h2 className="font-heading font-bold text-lg text-foreground mb-5">Assessment Types</h2>
        <div className="space-y-4">
          {assessmentTypes.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex justify-between mb-1.5">
                <span className="text-sm text-foreground font-medium">{t.label}</span>
                <span className="text-xs text-muted-foreground font-semibold">{t.count} ({t.pct}%)</span>
              </div>
              <div className="progress-track !h-2.5">
                <motion.div
                  className={`h-full rounded-full ${t.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${t.pct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Age Distribution */}
      <div className="card-soft">
        <h2 className="font-heading font-bold text-lg text-foreground mb-5">Age Distribution</h2>
        <div className="space-y-4">
          {ageDistribution.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex justify-between mb-1.5">
                <span className="text-sm text-foreground font-medium">{a.label}</span>
                <span className="text-xs text-muted-foreground font-semibold">{a.pct}%</span>
              </div>
              <div className="progress-track !h-2.5">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${a.pct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    {/* Platform Health */}
    <div className="card-soft">
      <h2 className="font-heading font-bold text-lg text-foreground mb-4">Platform Health</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Server Uptime", value: "99.9%", icon: ArrowUpRight },
          { label: "Avg. Response Time", value: "120ms", icon: Clock },
          { label: "Error Rate", value: "0.02%", icon: BarChart3 },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-lg font-heading font-bold text-foreground">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default AdminReports;
