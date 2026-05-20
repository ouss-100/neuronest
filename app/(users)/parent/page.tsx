"use client";

import { useEffect, useState } from "react";
import {
  Baby,
  ClipboardList,
  Bell,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import { getParentDashboardStats } from "@/server/dashboardActions";
import { MOCK_PARENT_ID } from "@/lib/constants";

export default function ParentDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const res = await getParentDashboardStats(MOCK_PARENT_ID);
      if (res.success) {
        setStats(res.stats);
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
          Welcome back 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your children's progress.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Baby} label="Children" value={stats?.childrenCount?.toString() || "0"} color="primary" />
        <StatCard
          icon={ClipboardList}
          label="Assessments"
          value={stats?.assessmentsCount?.toString() || "0"}
          color="secondary"
        />
        <StatCard icon={TrendingUp} label="Latest Score" value={`${stats?.latestScore || 0}%`} color="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Children */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-foreground">
              Children Profiles
            </h2>
            <Link href="/parent/child-profile" className="btn-outline-primary !px-4 !py-2 text-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Child
            </Link>
          </div>
          
          {stats?.children?.length === 0 ? (
            <div className="card-soft text-center py-10 text-muted-foreground">
              No children added yet.
            </div>
          ) : (
            stats?.children?.map((child: any) => (
              <Link
                key={child._id}
                href="/parent/child-profile"
                className="card-soft-hover flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary font-heading font-bold flex items-center justify-center text-lg">
                    C
                  </div>
                  <div>
                    <p className="font-heading font-bold text-foreground">
                      Child
                    </p>
                    <p className="text-sm text-muted-foreground">Age {child.age}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5" /> Notifications
          </h2>
          <div className="space-y-2">
            {stats?.notifications?.length === 0 ? (
              <div className="card-soft text-center text-muted-foreground py-4 text-sm">
                No new notifications
              </div>
            ) : (
              stats?.notifications?.map((n: any, i: number) => (
                <div key={i} className="card-soft !p-4">
                  <p className="text-sm text-foreground">{n.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
