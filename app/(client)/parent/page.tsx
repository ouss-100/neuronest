"use client";
import {
  Baby,
  ClipboardList,
  Bell,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { children, notifications } from "@/assets/assets";
import StatCard from "@/components/StatCard";

const ParentDashboard = () => (
  <div className="space-y-6 max-w-6xl">
    <div>
      <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
        Welcome back, Sarah 👋
      </h1>
      <p className="text-muted-foreground mt-1">
        Here's an overview of your children's progress.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard icon={Baby} label="Children" value="2" color="primary" />
      <StatCard
        icon={ClipboardList}
        label="Assessments"
        value="3"
        change="+1 this month"
        color="secondary"
      />
      <StatCard icon={TrendingUp} label="Progress" value="82%" color="accent" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Children */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg text-foreground">
            Children Profiles
          </h2>
          <button className="btn-outline-primary !px-4 !py-2 text-sm flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Child
          </button>
        </div>
        {children.map((child) => (
          <Link
            key={child.name}
            href="/parent/children"
            className="card-soft-hover flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary font-heading font-bold flex items-center justify-center text-lg">
                {child.name[0]}
              </div>
              <div>
                <p className="font-heading font-bold text-foreground">
                  {child.name}
                </p>
                <p className="text-sm text-muted-foreground">Age {child.age}</p>
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
                {child.status === "completed" ? "Completed" : "Pending"}
              </span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
          <Bell className="w-5 h-5" /> Notifications
        </h2>
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <div key={i} className="card-soft !p-4">
              <p className="text-sm text-foreground">{n.text}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ParentDashboard;
