"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { results, recommendations } from "@/assets/assets";
import {
  ArrowLeft,
  Download,
  Share2,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

const Results = () => (
  <div className="space-y-6 max-w-4xl">
    <Link
      href="/parent"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="w-4 h-4" /> Back to Dashboard
    </Link>

    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
          Assessment Results
        </h1>
        <p className="text-muted-foreground mt-1">
          Emma • Full Screening • Mar 10, 2026
        </p>
      </div>
      <div className="flex gap-2">
        <button className="btn-outline-primary !px-4 !py-2.5 text-sm flex items-center gap-1.5">
          <Share2 className="w-4 h-4" /> Share
        </button>
        <button className="btn-primary !px-4 !py-2.5 text-sm flex items-center gap-1.5">
          <Download className="w-4 h-4" /> Download
        </button>
      </div>
    </div>

    {/* Overall Score */}
    <div className="card-soft !p-8 text-center">
      <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3 font-heading">
        Overall Score
      </p>
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${82 * 2.51} ${251.2}`}
            initial={{ strokeDasharray: "0 251.2" }}
            animate={{ strokeDasharray: `${82 * 2.51} ${251.2}` }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-heading font-bold text-foreground">
            82%
          </span>
        </div>
      </div>
      <p className="text-muted-foreground text-sm">
        Above average with some areas needing attention
      </p>
    </div>

    {/* Area breakdown */}
    <div className="card-soft">
      <h2 className="font-heading font-bold text-lg text-foreground mb-6">
        Score Breakdown
      </h2>
      <div className="space-y-4">
        {results.map((r, i) => (
          <motion.div
            key={r.area}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-4"
          >
            <div className="w-5 flex justify-center">
              {r.status === "attention" ? (
                <AlertCircle className="w-4 h-4 text-accent" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-secondary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-foreground">
                  {r.area}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {r.score}%
                </span>
              </div>
              <div className="progress-track !h-2">
                <motion.div
                  className={`h-full rounded-full ${r.status === "attention" ? "bg-accent" : "bg-secondary"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${r.score}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Recommendations */}
    <div className="card-soft">
      <h2 className="font-heading font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-secondary" /> Recommendations
      </h2>
      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
              {i + 1}
            </div>
            <p className="text-sm text-muted-foreground">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Results;
