"use client";

import { motion } from "framer-motion";
import { FileText, Download, Share2, Calendar } from "lucide-react";
import { reports } from "@/assets/assets";

const DoctorReports = () => (
  <div className="space-y-6 max-w-4xl">
    <div>
      <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
        Reports
      </h1>
      <p className="text-muted-foreground mt-1">
        View and manage detailed assessment reports
      </p>
    </div>

    <div className="space-y-3">
      {reports.map((r, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="card-soft-hover flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="font-heading font-bold text-foreground text-sm">
                {r.child}
              </p>
              <p className="text-xs text-muted-foreground">
                {r.type} • <Calendar className="w-3 h-3 inline" /> {r.date}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={
                r.status === "completed" ? "badge-completed" : "badge-pending"
              }
            >
              {r.status === "completed" ? "Final" : "Draft"}
            </span>
            <button className="p-2 rounded-xl hover:bg-muted transition-colors">
              <Share2 className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-xl hover:bg-muted transition-colors">
              <Download className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default DoctorReports;
