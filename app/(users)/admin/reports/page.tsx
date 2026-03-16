"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react";
import StatCard from "@/components/StatCard";

const AdminReports = () => (
  <div className="space-y-6 max-w-6xl">
    <div>
      <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Reports & Analytics</h1>
      <p className="text-muted-foreground mt-1">Platform usage statistics and assessment analytics</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Users} label="New Users" value="156" change="+23% vs last month" color="primary" />
      <StatCard icon={BarChart3} label="Assessments" value="482" change="+15% vs last month" color="secondary" />
      <StatCard icon={Clock} label="Avg. Duration" value="7.2 min" color="accent" />
      <StatCard icon={TrendingUp} label="Satisfaction" value="4.8/5" color="primary" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card-soft">
        <h2 className="font-heading font-bold text-lg text-foreground mb-4">User Growth</h2>
        <div className="h-48 bg-muted/30 rounded-2xl flex items-end gap-3 px-6 pb-4">
          {[30, 45, 50, 65, 55, 80, 70, 85, 90, 78, 95, 88].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="flex-1 bg-secondary rounded-t-lg"
            />
          ))}
        </div>
      </div>

      <div className="card-soft">
        <h2 className="font-heading font-bold text-lg text-foreground mb-4">Assessment Types</h2>
        <div className="space-y-4">
          {[
            { label: "Full Screening", pct: 45, color: "bg-primary" },
            { label: "Reading Assessment", pct: 30, color: "bg-secondary" },
            { label: "ADHD Screening", pct: 15, color: "bg-accent" },
            { label: "Initial Screening", pct: 10, color: "bg-muted-foreground" },
          ].map((t, i) => (
            <div key={t.label}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-foreground font-medium">{t.label}</span>
                <span className="text-sm text-muted-foreground">{t.pct}%</span>
              </div>
              <div className="progress-track !h-2">
                <motion.div
                  className={`h-full rounded-full ${t.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${t.pct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AdminReports;
