"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Stethoscope, Calendar, FileText, FlaskConical } from "lucide-react";
import { getRapportsByChild } from "@/server/rapportActions";
import { getChildrenByParent } from "@/server/childActions";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { MOCK_PARENT_ID } from "@/lib/constants";

export default function ParentRecommendations() {
  const [rapports, setRapports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    async function load() {
      const parentId = session?.user?.id || MOCK_PARENT_ID;
      if (!parentId) return;
      setLoading(true);
      // Get all children for this parent, then fetch rapports for each
      const childrenRes = await getChildrenByParent(parentId);
      if (childrenRes.success && childrenRes.children.length > 0) {
        // Fetch rapports for all children
        const allRapports: any[] = [];
        for (const child of childrenRes.children) {
          const res = await getRapportsByChild(child._id);
          if (res.success && res.rapports) {
            allRapports.push(
              ...res.rapports.map((r: any) => ({ ...r, childAge: child.age }))
            );
          }
        }
        // Sort by date, newest first
        allRapports.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRapports(allRapports);
      }
      setLoading(false);
    }
    
    load();
  }, [session?.user?.id, status]);

  return (
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
          Professional reports and feedback from your doctors
        </p>
      </div>

      {loading ? (
        <div className="card-soft text-center text-muted-foreground py-10">
          <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-3" />
          Loading recommendations...
        </div>
      ) : rapports.length === 0 ? (
        <div className="card-soft text-center text-muted-foreground py-12 space-y-3">
          <Stethoscope className="w-10 h-10 mx-auto text-muted-foreground/40" />
          <p className="font-medium">No doctor reports yet</p>
          <p className="text-sm">
            Once a doctor writes a report for your child, it will appear here.
          </p>
          <Link href="/parent/doctors" className="btn-accent inline-flex items-center gap-2 text-sm mt-2">
            Find a Doctor
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {rapports.map((rapport, i) => (
            <Link href={`/parent/rapports/${rapport._id}`} key={rapport._id || i} className="block">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-soft-hover"
              >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading font-bold text-foreground">{rapport.title}</h3>
                    <span className="badge-active text-xs">Child age {rapport.childAge}</span>
                  </div>

                  <p className="text-sm text-muted-foreground">{rapport.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="rounded-2xl bg-muted/40 p-3 space-y-1">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Diagnosis</p>
                      <p className="text-sm text-muted-foreground">{rapport.diagnosis}</p>
                    </div>
                    <div className="rounded-2xl bg-muted/40 p-3 space-y-1">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Recommendations</p>
                      <p className="text-sm text-muted-foreground">{rapport.recommendations}</p>
                    </div>
                  </div>

                  {rapport.medications && (
                    <div className="rounded-2xl bg-secondary/5 border border-secondary/20 p-3">
                      <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">Medications</p>
                      <p className="text-sm text-muted-foreground">{rapport.medications}</p>
                    </div>
                  )}

                  {rapport.exercises && (
                    <div className="rounded-2xl bg-accent/5 border border-accent/20 p-3">
                      <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
                        <FlaskConical className="w-3 h-3 inline mr-1" />
                        Exercises
                      </p>
                      <p className="text-sm text-muted-foreground">{rapport.exercises}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <Stethoscope className="w-3 h-3" />
                      Dr. {rapport.doctorId?.firstname ?? ""} {rapport.doctorId?.lastname ?? "Unknown"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(rapport.createdAt), "MMM d, yyyy")}
                    </span>
                    {rapport.nextVisitDate && (
                      <span className="flex items-center gap-1 text-primary font-medium">
                        <FileText className="w-3 h-3" />
                        Next visit: {format(new Date(rapport.nextVisitDate), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
