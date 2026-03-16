"use client";

import { motion } from "framer-motion";
import { Users, ClipboardList, Bell, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/StatCard";

const children = [
  {
    name: "Emma Johnson",
    age: 7,
    parent: "Sarah Johnson",
    status: "pending",
    lastSeen: "Mar 10, 2026",
  },
  {
    name: "Oliver Chen",
    age: 9,
    parent: "Wei Chen",
    status: "completed",
    lastSeen: "Mar 8, 2026",
  },
  {
    name: "Sophia Martinez",
    age: 6,
    parent: "Ana Martinez",
    status: "pending",
    lastSeen: "Mar 12, 2026",
  },
];

const notifications = [
  {
    text: "New assessment for Emma Johnson is ready for review",
    time: "1 hour ago",
  },
  {
    text: "Appointment with Wei Chen confirmed for Mar 20",
    time: "3 hours ago",
  },
  { text: "Ana Martinez requested a consultation", time: "1 day ago" },
];

const DoctorDashboard = () => (
  <div className="space-y-6 max-w-6xl">
    <div className="flex flex-col lg:flex-row justify-between gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
          Good morning, Dr. Smith 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          You have 2 pending assessments to review.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Users}
        label="Assigned Children"
        value="12"
        color="primary"
      />
      <StatCard
        icon={ClipboardList}
        label="Pending Reviews"
        value="5"
        change="2 urgent"
        color="accent"
      />
      <StatCard
        icon={Calendar}
        label="Appointments"
        value="3"
        change="This week"
        color="secondary"
      />
      <StatCard icon={Bell} label="Notifications" value="7" color="primary" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="font-heading font-bold text-lg text-foreground">
          Assigned Children
        </h2>
        {children.map((child, i) => (
          <motion.div
            key={child.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href="/doctor/evaluations"
              className="card-soft-hover flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary font-heading font-bold flex items-center justify-center text-lg">
                  {child.name[0]}
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground text-sm">
                    {child.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Age {child.age} • Parent: {child.parent}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={
                    child.status === "completed"
                      ? "badge-completed"
                      : "badge-pending"
                  }
                >
                  {child.status === "completed" ? "Reviewed" : "Pending"}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="font-heading font-bold text-lg text-foreground">
          Recent Notifications
        </h2>
        {notifications.map((n, i) => (
          <div key={i} className="card-soft !p-4">
            <p className="text-sm text-foreground">{n.text}</p>
            <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DoctorDashboard;
