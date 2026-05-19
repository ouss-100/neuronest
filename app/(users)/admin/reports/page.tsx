"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  ArrowUpRight,
  Download,
  FileText,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import StatCard from "@/components/StatCard";
import SearchInput from "@/components/admin/SearchInput";
import FilterTabs from "@/components/admin/FilterTabs";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  {
    label: "Initial Screening",
    pct: 10,
    count: "278",
    color: "bg-muted-foreground",
  },
];

const ageDistribution = [
  { label: "3–5 years", pct: 20 },
  { label: "6–8 years", pct: 40 },
  { label: "9–11 years", pct: 28 },
  { label: "12+ years", pct: 12 },
];

interface ReportEntry {
  id: number;
  child: string;
  parent: string;
  type: string;
  score: number;
  date: string;
  status: "completed" | "pending" | "flagged";
}

const reportEntries: ReportEntry[] = [
  {
    id: 1,
    child: "Emma Johnson",
    parent: "Sarah Johnson",
    type: "Full Screening",
    score: 82,
    date: "Mar 10, 2026",
    status: "completed",
  },
  {
    id: 2,
    child: "Oliver Chen",
    parent: "Wei Chen",
    type: "Reading Assessment",
    score: 68,
    date: "Mar 9, 2026",
    status: "flagged",
  },
  {
    id: 3,
    child: "Liam Martinez",
    parent: "Ana Martinez",
    type: "ADHD Screening",
    score: 75,
    date: "Mar 8, 2026",
    status: "completed",
  },
  {
    id: 4,
    child: "Sophia Davis",
    parent: "Emily Davis",
    type: "Full Screening",
    score: 91,
    date: "Mar 7, 2026",
    status: "completed",
  },
  {
    id: 5,
    child: "Noah Brown",
    parent: "Michael Brown",
    type: "Initial Screening",
    score: 58,
    date: "Mar 6, 2026",
    status: "flagged",
  },
  {
    id: 6,
    child: "Ava Kim",
    parent: "Dr. Robert Kim",
    type: "Reading Assessment",
    score: 88,
    date: "Mar 5, 2026",
    status: "completed",
  },
  {
    id: 7,
    child: "Lucas Rivera",
    parent: "Carlos Rivera",
    type: "Full Screening",
    score: 72,
    date: "Mar 4, 2026",
    status: "pending",
  },
  {
    id: 8,
    child: "Mia Ali",
    parent: "Dr. Fatima Ali",
    type: "ADHD Screening",
    score: 79,
    date: "Mar 3, 2026",
    status: "completed",
  },
];

const AdminReports = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [dateRange, setDateRange] = useState("This Month");

  const filtered = reportEntries.filter((r) => {
    const matchesSearch =
      r.child.toLowerCase().includes(search.toLowerCase()) ||
      r.parent.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "Completed" && r.status === "completed") ||
      (filter === "Flagged" && r.status === "flagged") ||
      (filter === "Pending" && r.status === "pending");
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    toast.success("Report exported", {
      description: "The full analytics report has been downloaded as CSV.",
    });
  };

  const handleDownloadReport = (child: string) => {
    toast.success("Report downloaded", {
      description: `${child}'s assessment report has been saved.`,
    });
  };

  return (
    <div className="space-y-6">
      <Toaster />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Platform usage statistics and assessment analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="This Week">This Week</SelectItem>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="This Quarter">This Quarter</SelectItem>
                <SelectItem value="This Year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            onClick={handleExport}
            className="rounded-2xl"
          >
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="New Users"
          value="156"
          change="+23% vs last month"
          color="primary"
        />
        <StatCard
          icon={BarChart3}
          label="Assessments"
          value="482"
          change="+15% vs last month"
          color="secondary"
        />
        <StatCard
          icon={Clock}
          label="Avg. Duration"
          value="7.2 min"
          color="accent"
        />
        <StatCard
          icon={TrendingUp}
          label="Satisfaction"
          value="4.8/5"
          change="+0.3 this month"
          color="primary"
        />
      </div>

      {/* Dual bar chart */}
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
            {monthlyGrowth.map((m, i) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[32px] border-border/50 shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-lg">Assessment Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assessmentTypes.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-foreground font-medium">
                    {t.label}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {t.count} ({t.pct}%)
                  </span>
                </div>
                <Progress value={t.pct} className="h-2.5" />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-border/50 shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-lg">Age Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ageDistribution.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-foreground font-medium">
                    {a.label}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {a.pct}%
                  </span>
                </div>
                <Progress value={a.pct} className="h-2.5" />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Assessment Reports */}
      <Card className="rounded-[32px] border-border/50 shadow-[var(--shadow-soft)]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Recent Assessment
              Reports
            </CardTitle>
            <SearchInput
              placeholder="Search by child or parent..."
              value={search}
              onChange={setSearch}
            />
          </div>
        </CardHeader>
        <CardContent>
          <FilterTabs
            tabs={["All", "Completed", "Flagged", "Pending"]}
            active={filter}
            onChange={setFilter}
          />

          <div className="mt-4 space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No reports match your filters.
                </p>
              </div>
            ) : (
              filtered.map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        report.status === "flagged"
                          ? "bg-accent/10 text-accent"
                          : report.status === "pending"
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {report.child}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {report.parent} • {report.type} • {report.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-heading font-bold ${
                        report.score >= 80
                          ? "text-secondary"
                          : report.score >= 60
                            ? "text-primary"
                            : "text-accent"
                      }`}
                    >
                      {report.score}%
                    </span>
                    <Badge
                      variant={
                        report.status === "completed"
                          ? "completed"
                          : report.status === "flagged"
                            ? "pending"
                            : "active"
                      }
                    >
                      {report.status.charAt(0).toUpperCase() +
                        report.status.slice(1)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadReport(report.child)}
                      title="Download report"
                      className="rounded-xl"
                    >
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Platform Health */}
      <Card className="rounded-[32px] border-border/50 shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="text-lg">Platform Health</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <p className="text-lg font-heading font-bold text-foreground">
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
