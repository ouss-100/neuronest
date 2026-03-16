"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import { assessments } from "@/assets/assets";

const ChildProfile = () => (
  <div className="space-y-6 max-w-4xl">
    <Link
      href="/parent"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="w-4 h-4" /> Back to Dashboard
    </Link>

    <div className="card-soft flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary font-heading font-bold text-3xl flex items-center justify-center">
        E
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Emma
        </h1>
        <p className="text-muted-foreground">Age 7 • Grade 2 • Female</p>
        <div className="flex gap-2 mt-3">
          <span className="badge-completed">Latest: 82%</span>
          <span className="badge-active">3 assessments</span>
        </div>
      </div>
      <Link
        href="/parent/assessment"
        className="btn-accent !px-5 !py-2.5 text-sm"
      >
        New Assessment
      </Link>
    </div>

    {/* Progress */}
    <div className="card-soft">
      <h2 className="font-heading font-bold text-lg text-foreground mb-4">
        Progress Over Time
      </h2>
      <div className="h-40 bg-muted/30 rounded-2xl flex items-center justify-center">
        <div className="flex items-end gap-6 h-full py-6 px-8">
          {[68, 75, 82].map((val, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="w-12 bg-primary/20 rounded-xl relative overflow-hidden"
              >
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary rounded-xl"
                  style={{ height: `${val}%` }}
                />
              </motion.div>
              <span className="text-xs text-muted-foreground font-medium">
                {val}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Assessment History */}
    <div>
      <h2 className="font-heading font-bold text-lg text-foreground mb-4">
        Assessment History
      </h2>
      <div className="space-y-3">
        {assessments.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-soft-hover flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-heading font-semibold text-foreground text-sm">
                  {a.type}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {a.date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge-completed">Score: {a.score}%</span>
              <Link
                href="/parent/results"
                className="text-sm text-primary font-semibold hover:underline"
              >
                View
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default ChildProfile;
