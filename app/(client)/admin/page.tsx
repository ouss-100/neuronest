"use client";

import { motion } from "framer-motion";
import {
  Users,
  ClipboardList,
  BarChart3,
  TrendingUp,
  Activity,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const recentActivity = [
  { text: "New parent registration: Ana Martinez", time: "1 hour ago" },
  { text: "Assessment completed: Oliver Chen", time: "3 hours ago" },
  {
    text: "Dr. Smith submitted evaluation for Emma Johnson",
    time: "5 hours ago",
  },
  { text: "New article published: Early Signs of Dyslexia", time: "1 day ago" },
];

const AdminDashboard = () => (
  <div className="space-y-6 max-w-6xl">
    <div>
      <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
        Admin Dashboard
      </h1>
      <p className="text-muted-foreground mt-1">
        Platform overview and analytics
      </p>
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
        color="primary"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart placeholder */}
      <div className="card-soft">
        <h2 className="font-heading font-bold text-lg text-foreground mb-4">
          Assessments Over Time
        </h2>
        <div className="h-48 bg-muted/30 rounded-2xl flex items-end gap-2 px-4 pb-4">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="flex-1 bg-primary/20 rounded-t-lg relative overflow-hidden"
            >
              <div
                className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg"
                style={{ height: `${h}%` }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div className="card-soft">
        <h2 className="font-heading font-bold text-lg text-foreground mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> Recent Activity
        </h2>
        <div className="space-y-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              <div>
                <p className="text-sm text-foreground">{a.text}</p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
