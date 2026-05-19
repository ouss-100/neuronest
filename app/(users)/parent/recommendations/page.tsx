"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Stethoscope, Calendar } from "lucide-react";
import { notes } from "@/assets/assets";

const ParentRecommendations = () => (
  <div className="space-y-6">
    <Link
      href="/parent"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="w-4 h-4" /> Back to Dashboard
    </Link>

    <div>
      <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
        Doctor Recommendations
      </h1>
      <p className="text-muted-foreground mt-1">
        Professional feedback for Emma's assessments
      </p>
    </div>

    <div className="space-y-4">
      {notes.map((note, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className="card-soft"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="font-heading font-bold text-foreground">
                  {note.title}
                </h3>
                <span className="badge-active text-xs">{note.type}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {note.content}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Stethoscope className="w-3 h-3" /> {note.doctor}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {note.date}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default ParentRecommendations;
