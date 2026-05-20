"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, Calendar, X, Send, ChevronDown, ChevronUp } from "lucide-react";
import { getRapportsByDoctor, createRapport } from "@/server/rapportActions";
import { getAppointmentsByDoctor } from "@/server/appointmentActions";
import { MOCK_DOCTOR_ID } from "@/lib/constants";
import { format } from "date-fns";
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

export default function DoctorReports() {
  const [rapports, setRapports] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    setLoading(true);
    // Fetch rapports
    const rapportsRes = await getRapportsByDoctor(MOCK_DOCTOR_ID);
    if (rapportsRes.success) setRapports(rapportsRes.rapports || []);

    // Fetch children via confirmed appointments to populate the dropdown
    const apptRes = await getAppointmentsByDoctor(MOCK_DOCTOR_ID);
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
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.childId || !form.title || !form.description || !form.diagnosis || !form.recommendations) return;
    setSubmitting(true);
    await createRapport({
      doctorId: MOCK_DOCTOR_ID,
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
    setSubmitting(false);
    setShowForm(false);
    setForm({ childId: "", title: "", description: "", diagnosis: "", notes: "", recommendations: "", medications: "", exercises: "", nextVisitDate: "" });
    fetchData();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">View and create detailed patient reports</p>
        </div>
        <Button variant={"accent" as any} onClick={() => setShowForm(true)} className="rounded-2xl">
          <Plus className="w-4 h-4 mr-2" /> New Report
        </Button>
      </div>

      {loading ? (
        <div className="card-soft text-center text-muted-foreground py-10">
          <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-3" />
          Loading reports...
        </div>
      ) : rapports.length === 0 ? (
        <div className="card-soft text-center text-muted-foreground py-12 space-y-3">
          <FileText className="w-10 h-10 mx-auto text-muted-foreground/40" />
          <p className="font-medium">No reports yet</p>
          <p className="text-sm">Create a report after evaluating a patient.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rapports.map((r, i) => {
            const isExpanded = expandedId === r._id;
            return (
              <motion.div
                key={r._id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card-soft-hover"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-foreground text-sm">{r.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Child age {r.childId?.age ?? "—"} •{" "}
                        <Calendar className="w-3 h-3 inline" />{" "}
                        {r.createdAt ? format(new Date(r.createdAt), "MMM d, yyyy") : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge-completed">Final</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => setExpandedId(isExpanded ? null : r._id)}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-border/50 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-muted/40 p-3">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1">Diagnosis</p>
                        <p className="text-sm text-muted-foreground">{r.diagnosis}</p>
                      </div>
                      <div className="rounded-2xl bg-muted/40 p-3">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1">Recommendations</p>
                        <p className="text-sm text-muted-foreground">{r.recommendations}</p>
                      </div>
                    </div>
                    {r.notes && (
                      <div className="rounded-2xl bg-muted/40 p-3">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1">Notes</p>
                        <p className="text-sm text-muted-foreground">{r.notes}</p>
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

      {/* New Report Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="rounded-[32px] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Patient (Child)</Label>
              <Select value={form.childId} onValueChange={(v) => setForm({ ...form, childId: v })}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder="Select patient..." />
                </SelectTrigger>
                <SelectContent>
                  {children.length === 0 ? (
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
            </div>

            <div className="space-y-2">
              <Label>Report Title</Label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-2xl" placeholder="e.g. Initial Screening Report" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-2xl resize-none" placeholder="Brief overview..." />
            </div>
            <div className="space-y-2">
              <Label>Diagnosis</Label>
              <Textarea required value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} className="rounded-2xl resize-none" placeholder="Clinical diagnosis..." />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="rounded-2xl resize-none" placeholder="Additional clinical notes..." />
            </div>
            <div className="space-y-2">
              <Label>Recommendations</Label>
              <Textarea required value={form.recommendations} onChange={(e) => setForm({ ...form, recommendations: e.target.value })} className="rounded-2xl resize-none" placeholder="Recommendations for the parent..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
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
            <DialogFooter>
              <Button type="button" variant={"outline-primary" as any} onClick={() => setShowForm(false)} className="rounded-2xl">Cancel</Button>
              <Button type="submit" variant={"accent" as any} disabled={submitting} className="rounded-2xl">
                <Send className="w-4 h-4 mr-2" />
                {submitting ? "Saving..." : "Save Report"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
