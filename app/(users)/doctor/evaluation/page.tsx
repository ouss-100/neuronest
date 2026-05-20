"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, CheckCircle2, Send, Users, Brain } from "lucide-react";
import Link from "next/link";
import { getAppointmentsByDoctor } from "@/server/appointmentActions";
import { getAssessmentsByChild } from "@/server/assessmentActions";
import { createRapport } from "@/server/rapportActions";
import { MOCK_DOCTOR_ID } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export default function DoctorEvaluation() {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAssessments, setLoadingAssessments] = useState(false);

  // Form state
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getAppointmentsByDoctor(MOCK_DOCTOR_ID);
      if (res.success && res.appointments) {
        // Get unique children from appointments
        const map = new Map<string, any>();
        for (const appt of res.appointments) {
          if (appt.childId && !map.has(appt.childId._id)) {
            map.set(appt.childId._id, {
              ...appt.childId,
              parent: appt.parentId,
            });
          }
        }
        setPatients(Array.from(map.values()));
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSelectPatient(child: any) {
    setSelectedPatient(child);
    setSelectedAssessment(null);
    setAssessments([]);
    setSuccess(false);
    setLoadingAssessments(true);
    const res = await getAssessmentsByChild(child._id);
    if (res.success) setAssessments(res.assessments || []);
    setLoadingAssessments(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPatient || !diagnosis || !recommendations) return;
    setSubmitting(true);
    await createRapport({
      doctorId: MOCK_DOCTOR_ID,
      childId: selectedPatient._id,
      title: `Evaluation Report — ${diagnosis.slice(0, 40)}`,
      description: notes || "Professional evaluation based on AI screening results.",
      diagnosis,
      notes,
      recommendations,
    });
    setSubmitting(false);
    setSuccess(true);
    setNotes("");
    setDiagnosis("");
    setRecommendations("");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/doctor" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Patient Evaluation</h1>
        <p className="text-muted-foreground mt-1">Review AI screening results and submit your professional evaluation</p>
      </div>

      {/* Patient selection */}
      <div className="card-soft space-y-3">
        <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> Select Patient
        </h2>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading patients...</div>
        ) : patients.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No patients yet. Patients appear once appointments are booked.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {patients.map((child) => (
              <button
                key={child._id}
                onClick={() => handleSelectPatient(child)}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all hover:-translate-y-0.5 ${
                  selectedPatient?._id === child._id
                    ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]"
                    : "border-border/50 hover:border-primary/30"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-heading font-bold flex items-center justify-center">
                  C
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Child age {child.age}</p>
                  <p className="text-xs text-muted-foreground">
                    Parent: {child.parent?.firstname ?? "Unknown"} {child.parent?.lastname ?? ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Screening Results */}
      {selectedPatient && (
        <>
          <div className="card-soft space-y-4">
            <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              <Brain className="w-5 h-5 text-secondary" /> AI Screening History
            </h2>

            {loadingAssessments ? (
              <div className="text-sm text-muted-foreground">Loading assessments...</div>
            ) : assessments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No AI assessments taken yet for this patient.</p>
            ) : (
              <div className="space-y-3">
                {assessments.map((a, idx) => (
                  <button
                    key={a._id}
                    onClick={() => setSelectedAssessment(selectedAssessment?._id === a._id ? null : a)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      selectedAssessment?._id === a._id
                        ? "border-secondary bg-secondary/5"
                        : "border-border/50 hover:border-secondary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          Screening #{assessments.length - idx} — Score: {a.score}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {a.createdAt ? format(new Date(a.createdAt), "MMM d, yyyy") : ""}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        a.score >= 80 ? "bg-secondary/10 text-secondary" : "bg-accent/10 text-accent"
                      }`}>
                        {a.score >= 80 ? "Good" : "Needs Review"}
                      </span>
                    </div>

                    {selectedAssessment?._id === a._id && (
                      <div className="mt-4 space-y-3">
                        {a.analysis?.map((r: any, i: number) => (
                          <motion.div
                            key={r.area}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-center gap-4"
                          >
                            <div className="w-5 flex justify-center">
                              {r.status === "attention"
                                ? <AlertCircle className="w-4 h-4 text-accent" />
                                : <CheckCircle2 className="w-4 h-4 text-secondary" />}
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
                                  transition={{ duration: 0.7, delay: i * 0.08 }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {a.recommendations?.length > 0 && (
                          <div className="rounded-2xl bg-muted/40 p-3 mt-2">
                            <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1">AI Recommendations</p>
                            <ul className="space-y-1">
                              {a.recommendations.map((rec: string, ri: number) => (
                                <li key={ri} className="text-sm text-muted-foreground flex gap-2">
                                  <span className="text-primary font-bold">{ri + 1}.</span> {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Professional Evaluation Form */}
          <div className="card-soft">
            <h2 className="font-heading font-bold text-lg text-foreground mb-4">Professional Evaluation</h2>
            {success ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-secondary mx-auto" />
                <p className="font-semibold text-foreground">Evaluation saved successfully!</p>
                <p className="text-sm text-muted-foreground">The report is now visible to the parent.</p>
                <Button variant={"outline-primary" as any} onClick={() => setSuccess(false)} className="rounded-2xl mt-2">
                  Write Another
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label>Diagnosis Impression</Label>
                  <Select value={diagnosis} onValueChange={setDiagnosis}>
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue placeholder="Select an impression..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Possible Dyslexia - Recommend full evaluation">Possible Dyslexia — Recommend full evaluation</SelectItem>
                      <SelectItem value="Possible ADHD - Recommend behavioral assessment">Possible ADHD — Recommend behavioral assessment</SelectItem>
                      <SelectItem value="Within normal range - Monitor and follow up">Within normal range — Monitor and follow up</SelectItem>
                      <SelectItem value="Multiple concerns - Comprehensive evaluation needed">Multiple concerns — Comprehensive evaluation needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Clinical Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="rounded-2xl resize-none min-h-[100px]"
                    placeholder="Add your clinical observations..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Recommendations for Parents</Label>
                  <Textarea
                    required
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    className="rounded-2xl resize-none min-h-[80px]"
                    placeholder="Write actionable recommendations..."
                  />
                </div>
                <Button
                  type="submit"
                  variant={"accent" as any}
                  disabled={submitting || !diagnosis || !recommendations}
                  className="rounded-2xl flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Saving..." : "Save Evaluation"}
                </Button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}
