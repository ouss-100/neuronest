"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, AlertCircle } from "lucide-react";
import { getRapportsByDoctor } from "@/server/rapportActions";
import { getAppointmentsByDoctor } from "@/server/appointmentActions";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DoctorReports() {
  const [rapports, setRapports] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchData = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    // Fetch rapports
    const rapportsRes = await getRapportsByDoctor(session.user.id);
    if (rapportsRes.success) {
      // Sort: Drafts first, then newest first
      console.log("rapportsRes", rapportsRes);  
      console.log("rapportsRes.rapports");  
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

  const draftsCount = rapports.filter(r => r.isDraft).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">View and complete detailed patient reports</p>
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
            const isDraft = r.isDraft;
            
            return (
              <Link href={`/doctor/reports/${r._id}`} key={r._id || i} className="block">
                <motion.div
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
                </div>
              </motion.div>
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
