"use client";

import { useEffect, useState } from "react";
import { getRapportById, updateRapport } from "@/server/rapportActions";
import { format } from "date-fns";
import { ArrowLeft, User, Stethoscope, Brain, FileText, Calendar, Edit2, Check, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";

export default function DoctorReportDetails({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<any>({});

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!data?.rapport) {
    return (
      <div className="text-center py-20 card-soft">
        <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-foreground">Report Not Found</h2>
        <p className="text-muted-foreground mt-2 mb-6">The report you are looking for does not exist.</p>
        <Link href="/doctor/reports" className="btn-primary px-6 py-2">Back to Reports</Link>
      </div>
    );
  }

  const { rapport, assessment } = data;
  const child = rapport.childId;
  const parent = child?.parentId;

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateRapport(rapport._id, {
      ...form,
      nextVisitDate: form.nextVisitDate ? new Date(form.nextVisitDate) : undefined,
      isDraft: false, // Finalize draft if it was one
    } as any);

    if (res.success) {
      setData({ ...data, rapport: { ...rapport, ...res.rapport } });
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Link href="/doctor/reports" className="p-2 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{rapport.title}</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4" />
            {format(new Date(rapport.createdAt), "MMMM d, yyyy")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Parent & Child Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-1 space-y-6">
          <div className="card-soft space-y-4">
            <div className="flex items-center gap-2 text-primary font-semibold mb-2 border-b border-border/50 pb-2">
              <User className="w-5 h-5" /> Patient Info
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Child</p>
              <p className="text-sm font-medium text-foreground">Age {child?.age || "Unknown"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Parent Details</p>
              <p className="text-sm font-medium text-foreground">{parent?.firstname} {parent?.lastname}</p>
              <p className="text-sm text-muted-foreground">{parent?.email}</p>
              <p className="text-sm text-muted-foreground">{parent?.phone ? `${parent.phone.countryCode} ${parent.phone.number}` : "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Reported Symptoms</p>
              <ul className="list-disc list-inside text-sm text-foreground">
                {child?.symptoms?.map((s: any, i: number) => (
                  <li key={i}>{s.name}</li>
                )) || <li className="text-muted-foreground">None reported</li>}
              </ul>
            </div>
          </div>

          {/* AI Assessment Info */}
          {assessment ? (
            <div className="card-soft border-accent/20 bg-accent/5 space-y-4">
              <div className="flex items-center gap-2 text-accent font-semibold mb-2 border-b border-accent/20 pb-2">
                <Brain className="w-5 h-5" /> AI Assessment
              </div>
              <div className="text-center py-2">
                <span className="text-3xl font-heading font-black text-accent">{assessment.score}%</span>
                <p className="text-xs text-muted-foreground font-semibold mt-1">Development Score</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Analysis Areas</p>
                <div className="space-y-2">
                  {assessment.analysis?.map((a: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-foreground">{a.area}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${a.status === 'Concern' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">AI Recommendations</p>
                <ul className="list-disc list-inside text-sm text-foreground space-y-1">
                  {assessment.recommendations?.map((r: string, i: number) => (
                    <li key={i} className="leading-snug">{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="card-soft bg-muted/40 text-center py-8">
              <Brain className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No AI Assessment data available for this patient.</p>
            </div>
          )}
        </motion.div>

        {/* Doctor's Notes */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2 space-y-6">
          <div className="card-soft space-y-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Stethoscope className="w-5 h-5" /> Clinical Assessment
              </div>
              <div className="flex items-center gap-2">
                {rapport.isDraft && <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-md">DRAFT</span>}
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="btn-outline-primary text-xs py-1.5 px-3 flex items-center gap-2 rounded-xl">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => setIsEditing(false)} disabled={isSaving} className="btn-outline-primary text-xs py-1.5 px-3 rounded-xl border-border/50 text-muted-foreground hover:bg-muted/50">
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className="btn-accent text-xs py-1.5 px-3 flex items-center gap-2 rounded-xl">
                      <Check className="w-3.5 h-3.5" /> {isSaving ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Observation / Symptoms</p>
              {isEditing ? (
                <textarea className="w-full bg-background border border-border/50 rounded-2xl p-4 text-sm" rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Observations..." />
              ) : (
                <div className="bg-muted/30 p-4 rounded-2xl text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {rapport.description || "No specific observations recorded."}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Diagnosis</p>
              {isEditing ? (
                <textarea className="w-full bg-background border border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl p-4 text-sm" rows={3} value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})} placeholder="Clinical diagnosis..." />
              ) : (
                <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {rapport.diagnosis || "Pending diagnosis."}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Doctor's Recommendations</p>
              {isEditing ? (
                <textarea className="w-full bg-background border border-border/50 rounded-2xl p-4 text-sm" rows={4} value={form.recommendations} onChange={e => setForm({...form, recommendations: e.target.value})} placeholder="Recommendations for the parent..." />
              ) : (
                <div className="bg-muted/30 p-4 rounded-2xl text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {rapport.recommendations || "No specific recommendations provided."}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Additional Clinical Notes</p>
              {isEditing ? (
                <textarea className="w-full bg-background border border-border/50 rounded-2xl p-4 text-sm" rows={3} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Internal notes..." />
              ) : (
                <div className="bg-muted/30 p-4 rounded-2xl text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {rapport.notes || "No additional notes provided."}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-secondary/5 border border-secondary/20 p-4 rounded-2xl">
                <p className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">Medications prescribed</p>
                {isEditing ? (
                  <input className="w-full bg-background border border-secondary/30 rounded-xl px-3 py-2 text-sm mt-1" value={form.medications} onChange={e => setForm({...form, medications: e.target.value})} placeholder="e.g. Ritalin 5mg" />
                ) : (
                  <p className="text-sm font-medium text-foreground">{rapport.medications || "None prescribed."}</p>
                )}
              </div>
              <div className="bg-accent/5 border border-accent/20 p-4 rounded-2xl">
                <p className="text-xs text-accent uppercase font-bold tracking-wider mb-1">Recommended Exercises</p>
                {isEditing ? (
                  <input className="w-full bg-background border border-accent/30 rounded-xl px-3 py-2 text-sm mt-1" value={form.exercises} onChange={e => setForm({...form, exercises: e.target.value})} placeholder="e.g. Speech therapy tasks" />
                ) : (
                  <p className="text-sm font-medium text-foreground">{rapport.exercises || "None recommended."}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-primary/10 text-primary p-4 rounded-2xl font-semibold text-sm">
              <Calendar className="w-5 h-5 shrink-0" />
              {isEditing ? (
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm">Next Visit Scheduled:</span>
                  <input type="date" className="bg-background border border-primary/30 rounded-xl px-3 py-1.5 text-sm w-full max-w-[200px]" value={form.nextVisitDate} onChange={e => setForm({...form, nextVisitDate: e.target.value})} />
                </div>
              ) : (
                <span>Next Visit Scheduled: {rapport.nextVisitDate ? format(new Date(rapport.nextVisitDate), "MMMM d, yyyy") : "Not scheduled."}</span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
