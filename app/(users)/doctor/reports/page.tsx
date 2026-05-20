"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, Calendar, X, Send, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { getRapportsByDoctor, createRapport, updateRapport } from "@/server/rapportActions";
import { getAppointmentsByDoctor } from "@/server/appointmentActions";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";

export default function DoctorReports() {
  const [rapports, setRapports] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // To track which draft is being edited
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const { data: session } = useSession();

  // Form state
  const [form, setForm] = useState({
    childId: "",
    title: "",
    description: "",
    diagnosis: "",
    notes: "",
    recommendations: "",
    medications: "",
    exercises: "",
    nextVisitDate: "",
  });

  const fetchData = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    // Fetch rapports
    const rapportsRes = await getRapportsByDoctor(session.user.id);
    if (rapportsRes.success) {
      // Sort: Drafts first, then newest first
      const sorted = (rapportsRes.rapports || []).sort((a: any, b: any) => {
        if (a.isDraft === b.isDraft) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.isDraft ? -1 : 1;
      });
      setRapports(sorted);
    }

    // Fetch children via confirmed appointments to populate the dropdown
    const apptRes = await getAppointmentsByDoctor(session.user.id);
    if (apptRes.success) {
      const uniqueChildren = new Map<string, any>();
      for (const appt of apptRes.appointments || []) {
        if (appt.childId && !uniqueChildren.has(appt.childId._id)) {
          uniqueChildren.set(appt.childId._id, appt.childId);
        }
      }
      setChildren(Array.from(uniqueChildren.values()));
    }
    setLoading(false);
  }, [session?.user?.id]);

  useEffect(() => { 
    if (session?.user?.id) {
      fetchData(); 
    }
  }, [fetchData, session?.user?.id]);

  const openNewForm = () => {
    setEditingDraftId(null);
    setForm({ childId: "", title: "", description: "", diagnosis: "", notes: "", recommendations: "", medications: "", exercises: "", nextVisitDate: "" });
    setShowForm(true);
  };

  const openCompleteDraft = (rapport: any) => {
    setEditingDraftId(rapport._id);
    setForm({
      childId: rapport.childId._id,
      title: rapport.title,
      description: rapport.description,
      diagnosis: rapport.diagnosis || "",
      notes: rapport.notes || "",
      recommendations: rapport.recommendations || "",
      medications: rapport.medications || "",
      exercises: rapport.exercises || "",
      nextVisitDate: rapport.nextVisitDate ? format(new Date(rapport.nextVisitDate), "yyyy-MM-dd") : "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.childId || !form.title || !form.description || !form.diagnosis || !form.recommendations) return;
    setSubmitting(true);
    
    if (editingDraftId) {
      // Complete existing draft
      const res = await updateRapport(editingDraftId, {
        title: form.title,
        description: form.description,
        diagnosis: form.diagnosis,
        notes: form.notes,
        recommendations: form.recommendations,
        medications: form.medications || undefined,
        exercises: form.exercises || undefined,
        nextVisitDate: form.nextVisitDate ? new Date(form.nextVisitDate) : undefined,
        isDraft: false,
      } as any);
      
      if (res.success) {
        toast.success("Report completed and finalized");
      } else {
        toast.error("Failed to complete report");
      }
    } else {
      if (!session?.user?.id) return;
      // Create entirely new report from scratch
      const res = await createRapport({
        doctorId: session.user.id,
        childId: form.childId,
        title: form.title,
        description: form.description,
        diagnosis: form.diagnosis,
        notes: form.notes,
        recommendations: form.recommendations,
        medications: form.medications || undefined,
        exercises: form.exercises || undefined,
        nextVisitDate: form.nextVisitDate ? new Date(form.nextVisitDate) : undefined,
      });
      
      if (res.success) {
        toast.success("New report created successfully");
      } else {
        toast.error("Failed to create report");
      }
    }

    setSubmitting(false);
    setShowForm(false);
    fetchData();
  };

  const draftsCount = rapports.filter(r => r.isDraft).length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">View and complete detailed patient reports</p>
        </div>
        <Button variant={"accent" as any} onClick={openNewForm} className="rounded-2xl">
          <Plus className="w-4 h-4 mr-2" /> New Report
        </Button>
      </div>
      
      {draftsCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-[32px] flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Action Required</h3>
            <p className="text-sm opacity-90 mt-1">You have {draftsCount} pending report draft(s) awaiting completion.</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card-soft text-center text-muted-foreground py-10">
          <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-3" />
          Loading reports...
        </div>
      ) : rapports.length === 0 ? (
        <div className="card-soft text-center text-muted-foreground py-12 space-y-3">
          <FileText className="w-10 h-10 mx-auto text-muted-foreground/40" />
          <p className="font-medium">No reports yet</p>
          <p className="text-sm">Reports are automatically drafted when you confirm an appointment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rapports.map((r, i) => {
            const isExpanded = expandedId === r._id;
            const isDraft = r.isDraft;
            
            return (
              <motion.div
                key={r._id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={isDraft ? "card-soft-hover border-primary/40 bg-primary/5" : "card-soft-hover"}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isDraft ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-foreground text-sm">{r.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span>Child age {r.childId?.age ?? "—"}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {r.createdAt ? format(new Date(r.createdAt), "MMM d, yyyy") : "—"}
                        </span>
                        {r.appointmentId && (
                          <>
                            <span>•</span>
                            <span className="opacity-80">Linked to Appt</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isDraft ? (
                      <Button variant={"default" as any} size="sm" className="rounded-xl h-8 text-xs font-semibold" onClick={() => openCompleteDraft(r)}>
                        Complete Draft
                      </Button>
                    ) : (
                      <>
                        <span className="badge-completed">Final</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => setExpandedId(isExpanded ? null : r._id)}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {isExpanded && !isDraft && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-border/50 space-y-3"
                  >
                    <div className="rounded-2xl bg-muted/40 p-3">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1">Description / Symptoms</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{r.description}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-muted/40 p-3">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1">Diagnosis</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{r.diagnosis}</p>
                      </div>
                      <div className="rounded-2xl bg-muted/40 p-3">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1">Recommendations</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{r.recommendations}</p>
                      </div>
                    </div>
                    {r.notes && (
                      <div className="rounded-2xl bg-muted/40 p-3">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1">Notes</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{r.notes}</p>
                      </div>
                    )}
                    {r.medications && (
                      <div className="rounded-2xl bg-secondary/5 border border-secondary/20 p-3">
                        <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">Medications</p>
                        <p className="text-sm text-muted-foreground">{r.medications}</p>
                      </div>
                    )}
                    {r.exercises && (
                      <div className="rounded-2xl bg-accent/5 border border-accent/20 p-3">
                        <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">Exercises</p>
                        <p className="text-sm text-muted-foreground">{r.exercises}</p>
                      </div>
                    )}
                    {r.nextVisitDate && (
                      <p className="text-xs text-primary font-semibold">
                        Next Visit: {format(new Date(r.nextVisitDate), "MMM d, yyyy")}
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* New/Complete Report Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="rounded-[32px] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDraftId ? "Complete Assessment Report" : "Create New Report"}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Patient (Child)</Label>
              <Select disabled={!!editingDraftId} value={form.childId} onValueChange={(v) => setForm({ ...form, childId: v })}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder="Select patient..." />
                </SelectTrigger>
                <SelectContent>
                  {children.length === 0 && !editingDraftId ? (
                    <SelectItem value="none" disabled>No confirmed patients yet</SelectItem>
                  ) : (
                    children.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        Child age {c.age} (ID: {c._id?.slice(-6)})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {editingDraftId && <p className="text-xs text-muted-foreground">Patient is locked for this drafted report.</p>}
            </div>

            <div className="space-y-2">
              <Label>Report Title</Label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-2xl" placeholder="e.g. Initial Screening Report" />
            </div>
            <div className="space-y-2">
              <Label>Description / Symptoms</Label>
              <Textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-2xl resize-none h-24" placeholder="Brief overview or patient symptoms..." />
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <h4 className="text-sm font-semibold mb-4 text-primary">Doctor's Medical Assessment</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Diagnosis <span className="text-red-500">*</span></Label>
                  <Textarea required value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} className="rounded-2xl resize-none" placeholder="Clinical diagnosis..." />
                </div>
                <div className="space-y-2">
                  <Label>Recommendations <span className="text-red-500">*</span></Label>
                  <Textarea required value={form.recommendations} onChange={(e) => setForm({ ...form, recommendations: e.target.value })} className="rounded-2xl resize-none" placeholder="Recommendations for the parent..." />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="rounded-2xl resize-none" placeholder="Additional clinical notes..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Medications (optional)</Label>
                    <Input value={form.medications} onChange={(e) => setForm({ ...form, medications: e.target.value })} className="rounded-2xl" placeholder="e.g. Ritalin 5mg" />
                  </div>
                  <div className="space-y-2">
                    <Label>Exercises (optional)</Label>
                    <Input value={form.exercises} onChange={(e) => setForm({ ...form, exercises: e.target.value })} className="rounded-2xl" placeholder="e.g. Reading exercises" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Next Visit Date (optional)</Label>
                  <Input type="date" value={form.nextVisitDate} onChange={(e) => setForm({ ...form, nextVisitDate: e.target.value })} className="rounded-2xl" />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant={"outline-primary" as any} onClick={() => setShowForm(false)} className="rounded-2xl">Cancel</Button>
              <Button type="submit" variant={"accent" as any} disabled={submitting} className="rounded-2xl">
                <Send className="w-4 h-4 mr-2" />
                {submitting ? "Saving..." : "Finalize Report"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
