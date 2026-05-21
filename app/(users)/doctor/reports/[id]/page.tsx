"use client";

import { useEffect, useState } from "react";
import { getRapportById, updateRapport } from "@/server/rapportActions";
import { format } from "date-fns";
import {
  ArrowLeft,
  User,
  Stethoscope,
  Brain,
  FileText,
  Calendar,
  Edit2,
  Check,
  X,
  Download,
  Printer,
  Share2,
  AlertCircle,
  Clock,
  Mail,
  Phone,
  Cake,
  Syringe,
  Activity,
  Heart,
  Shield,
  ChevronRight,
  Sparkles,
  BookOpen,
  Pill,
  Dumbbell,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export default function DoctorReportDetails({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<any>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function loadData() {
      const res = await getRapportById(unwrappedParams.id);
      if (res.success) {
        setData(res);
        setForm({
          description: res.rapport.description || "",
          diagnosis: res.rapport.diagnosis || "",
          recommendations: res.rapport.recommendations || "",
          notes: res.rapport.notes || "",
          medications: res.rapport.medications || "",
          exercises: res.rapport.exercises || "",
          nextVisitDate: res.rapport.nextVisitDate ? format(new Date(res.rapport.nextVisitDate), "yyyy-MM-dd") : "",
        });
      }
      setLoading(false);
    }
    loadData();
  }, [unwrappedParams.id]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateRapport(rapport._id, {
      ...form,
      nextVisitDate: form.nextVisitDate ? new Date(form.nextVisitDate) : undefined,
      isDraft: false,
    } as any);

    if (res.success) {
      setData({ ...data, rapport: { ...rapport, ...res.rapport } });
      setIsEditing(false);
      showToast("Report saved successfully!", "success");
    } else {
      showToast("Failed to save report. Please try again.", "error");
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-primary/10 animate-pulse" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">Loading report details...</p>
      </div>
    );
  }

  if (!data?.rapport) {
    return (
      <motion.div {...fadeInUp} className="text-center py-20 max-w-md mx-auto">
        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 rounded-2xl p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Report Not Found</h2>
          <p className="text-muted-foreground mt-2 mb-6">The report you are looking for doesn't exist or has been deleted.</p>
          <Link href="/doctor/reports" className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Reports
          </Link>
        </div>
      </motion.div>
    );
  }

  const { rapport, assessment } = data;
  const child = rapport.childId;
  const parent = child?.parentId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
          >
            {toast.type === "success" ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/doctor/reports"
              className="p-2.5 rounded-xl bg-card border border-border hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {rapport.title}
                </h1>
                {rapport.isDraft && (
                  <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Draft
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(rapport.createdAt), "MMMM d, yyyy")}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{format(new Date(rapport.createdAt), "h:mm a")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"
              title="Download PDF"
            >
              <Download className="w-4 h-4 text-muted-foreground" />
            </button>

            <button
              className="p-2 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"
              title="Print"
            >
              <Printer className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>

        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patient Info & AI Assessment */}
          <div className="lg:col-span-1 space-y-6">
            {/* Patient Card */}
            <motion.div variants={fadeInUp} className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl" />
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">Patient Information</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                      <Cake className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Child</p>
                      <p className="text-sm font-medium text-foreground">
                        {child?.firstname} {child?.lastname} • Age {child?.age || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-green-50 dark:bg-green-950/30">
                      <Heart className="w-3.5 h-3.5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Parent/Guardian</p>
                      <p className="text-sm font-medium text-foreground">
                        {parent?.firstname} {parent?.lastname}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {parent?.email}
                        </span>
                        {parent?.phone && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {parent.phone.countryCode} {parent.phone.number}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ClipboardList className="w-3 h-3" /> Reported Symptoms
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {child?.symptoms?.map((s: any, i: number) => (
                      <span key={i} className="px-2 py-1 rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-medium">
                        {s.name}
                      </span>
                    )) || <span className="text-sm text-muted-foreground">None reported</span>}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Assessment Card */}
            <motion.div variants={fadeInUp}>
              {assessment ? (
                <div className="rounded-2xl bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 border border-violet-200 dark:border-violet-800/30 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                        <Brain className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      </div>
                      <span className="font-semibold text-sm text-violet-700 dark:text-violet-300">AI Clinical Assessment</span>
                    </div>
                    <Sparkles className="w-4 h-4 text-violet-400" />
                  </div>

                  <div className="text-center py-3">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="4" className="text-violet-200 dark:text-violet-800/50" />
                        <circle
                          cx="48"
                          cy="48"
                          r="42"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          strokeDashoffset={`${2 * Math.PI * 42 * (1 - assessment.score / 100)}`}
                          className="text-violet-500 dark:text-violet-400 transition-all duration-1000"
                        />
                      </svg>
                      <span className="absolute text-2xl font-bold text-violet-700 dark:text-violet-300">{assessment.score}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Development Score</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Analysis Areas</p>
                    <div className="space-y-2">
                      {assessment.analysis?.map((a: any, i: number) => (
                        <div key={i} className="flex justify-between items-center py-1.5 px-2 rounded-lg bg-white/50 dark:bg-black/20">
                          <span className="text-sm text-foreground">{a.area}</span>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.status === "Concern"
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                              }`}
                          >
                            {a.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                      <BookOpen className="w-3 h-3" /> AI Recommendations
                    </p>
                    <ul className="space-y-1.5">
                      {assessment.recommendations?.map((r: string, i: number) => (
                        <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-muted/30 border border-border p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No AI assessment available</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Run an analysis to get insights</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Clinical Notes */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={fadeInUp} className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-card to-muted/30 border-b border-border">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Stethoscope className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="font-semibold text-foreground">Clinical Assessment Report</h2>
                  </div>
                  <AnimatePresence mode="wait">
                    {!isEditing ? (
                      <motion.button
                        key="edit"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted/50 text-sm font-medium transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Report
                      </motion.button>
                    ) : (
                      <motion.div
                        key="save"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2"
                      >
                        <button
                          onClick={() => setIsEditing(false)}
                          disabled={isSaving}
                          className="p-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
                        >
                          {isSaving ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" /> Save Changes
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="p-5 space-y-6">
                {/* Observation */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" /> Observations / Symptoms
                  </label>
                  {isEditing ? (
                    <textarea
                      className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Record your clinical observations..."
                    />
                  ) : (
                    <div className="bg-muted/20 rounded-xl p-4 text-sm text-foreground leading-relaxed border border-border/50">
                      {rapport.description || "No observations recorded."}
                    </div>
                  )}
                </div>

                {/* Diagnosis */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> Diagnosis
                  </label>
                  {isEditing ? (
                    <textarea
                      className="w-full bg-background border border-primary/30 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      rows={3}
                      value={form.diagnosis}
                      onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                      placeholder="Enter clinical diagnosis..."
                    />
                  ) : (
                    <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 text-sm text-foreground leading-relaxed">
                      {rapport.diagnosis || "Pending diagnosis."}
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" /> Recommendations
                  </label>
                  {isEditing ? (
                    <textarea
                      className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      rows={4}
                      value={form.recommendations}
                      onChange={(e) => setForm({ ...form, recommendations: e.target.value })}
                      placeholder="Provide recommendations for the patient..."
                    />
                  ) : (
                    <div className="bg-muted/20 rounded-xl p-4 text-sm text-foreground leading-relaxed border border-border/50">
                      {rapport.recommendations || "No recommendations provided."}
                    </div>
                  )}
                </div>

                {/* Two Column - Medications & Exercises */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50/30 to-transparent dark:from-blue-950/10 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/30">
                    <label className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                      <Pill className="w-3.5 h-3.5" /> Medications
                    </label>
                    {isEditing ? (
                      <input
                        className="w-full bg-background border border-blue-300 dark:border-blue-700 rounded-lg px-3 py-2 text-sm"
                        value={form.medications}
                        onChange={(e) => setForm({ ...form, medications: e.target.value })}
                        placeholder="e.g., Methylphenidate 5mg"
                      />
                    ) : (
                      <p className="text-sm font-medium text-foreground">{rapport.medications || "None prescribed."}</p>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50/30 to-transparent dark:from-emerald-950/10 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-800/30">
                    <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                      <Dumbbell className="w-3.5 h-3.5" /> Exercises
                    </label>
                    {isEditing ? (
                      <input
                        className="w-full bg-background border border-emerald-300 dark:border-emerald-700 rounded-lg px-3 py-2 text-sm"
                        value={form.exercises}
                        onChange={(e) => setForm({ ...form, exercises: e.target.value })}
                        placeholder="e.g., Speech therapy exercises"
                      />
                    ) : (
                      <p className="text-sm font-medium text-foreground">{rapport.exercises || "None recommended."}</p>
                    )}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ClipboardList className="w-3.5 h-3.5" /> Additional Notes
                  </label>
                  {isEditing ? (
                    <textarea
                      className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Internal notes..."
                    />
                  ) : (
                    <div className="bg-muted/20 rounded-xl p-4 text-sm text-muted-foreground italic border border-border/50">
                      {rapport.notes || "No additional notes."}
                    </div>
                  )}
                </div>

                {/* Next Visit */}
                <div className="bg-gradient-to-r from-primary/5 to-primary/0 rounded-xl p-4 border border-primary/20">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Next Visit:</span>
                    {isEditing ? (
                      <input
                        type="date"
                        className="bg-background border border-primary/30 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        value={form.nextVisitDate}
                        onChange={(e) => setForm({ ...form, nextVisitDate: e.target.value })}
                      />
                    ) : (
                      <span className="text-sm text-primary font-medium">
                        {rapport.nextVisitDate ? format(new Date(rapport.nextVisitDate), "MMMM d, yyyy") : "Not scheduled"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}