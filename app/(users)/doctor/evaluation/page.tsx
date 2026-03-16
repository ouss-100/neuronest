"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const results = [
  { area: "Reading Comprehension", score: 72, status: "attention" },
  { area: "Letter Recognition", score: 85, status: "good" },
  { area: "Attention Span", score: 65, status: "attention" },
  { area: "Number Skills", score: 90, status: "good" },
];

const DoctorEvaluation = () => (
  <div className="space-y-6 max-w-4xl">
    <Link href="/doctor" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
      <ArrowLeft className="w-4 h-4" /> Back to Dashboard
    </Link>

    <div className="card-soft flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary font-heading font-bold text-2xl flex items-center justify-center">E</div>
      <div className="flex-1">
        <h1 className="text-2xl font-heading font-bold text-foreground">Emma Johnson</h1>
        <p className="text-muted-foreground">Age 7 • Parent: Sarah Johnson • Last assessment: Mar 10, 2026</p>
      </div>
      <span className="badge-pending">Pending Review</span>
    </div>

    {/* Results */}
    <div className="card-soft">
      <h2 className="font-heading font-bold text-lg text-foreground mb-6">Screening Results</h2>
      <div className="space-y-4">
        {results.map((r, i) => (
          <motion.div key={r.area} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-4">
            <div className="w-5 flex justify-center">
              {r.status === "attention" ? <AlertCircle className="w-4 h-4 text-accent" /> : <CheckCircle2 className="w-4 h-4 text-secondary" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-foreground">{r.area}</span>
                <span className="text-sm font-bold text-foreground">{r.score}%</span>
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

    {/* Professional Evaluation */}
    <div className="card-soft">
      <h2 className="font-heading font-bold text-lg text-foreground mb-4">Professional Evaluation</h2>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Clinical Notes</label>
          <textarea className="input-soft min-h-[120px] resize-none" placeholder="Add your clinical observations and notes..." />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Diagnosis Impression</label>
          <select className="input-soft">
            <option>Select an impression...</option>
            <option>Possible Dyslexia - Recommend full evaluation</option>
            <option>Possible ADHD - Recommend behavioral assessment</option>
            <option>Within normal range - Monitor and follow up</option>
            <option>Multiple concerns - Comprehensive evaluation needed</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Recommendations for Parents</label>
          <textarea className="input-soft min-h-[100px] resize-none" placeholder="Write recommendations for the parents..." />
        </div>
        <button type="submit" className="btn-accent flex items-center gap-2">
          <Send className="w-4 h-4" /> Save Evaluation
        </button>
      </form>
    </div>
  </div>
);

export default DoctorEvaluation;
