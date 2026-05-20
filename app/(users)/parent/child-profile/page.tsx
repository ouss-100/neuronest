"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, FileText, Plus } from "lucide-react";
import { getChildrenByParent, addChild } from "@/server/childActions";
import { getParentAssessments } from "@/server/aiAction";
import { MOCK_PARENT_ID } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export default function ChildProfile() {
  const [children, setChildren] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add Child state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChildAge, setNewChildAge] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [childrenRes, assessmentsRes] = await Promise.all([
      getChildrenByParent(MOCK_PARENT_ID),
      getParentAssessments()
    ]);
    
    if (childrenRes.success) setChildren(childrenRes.children);
    if (assessmentsRes.success) setAssessments(assessmentsRes.assessments);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildAge) return;
    
    setAdding(true);
    await addChild({
      parentId: MOCK_PARENT_ID,
      age: parseInt(newChildAge),
      symptoms: []
    });
    setAdding(false);
    setShowAddModal(false);
    setNewChildAge("");
    fetchData(); // Refresh list
  };

  return (
    <div className="space-y-6">
      <Link
        href="/parent"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-heading font-bold text-foreground">My Children</h2>
        <Button onClick={() => setShowAddModal(true)} variant={"accent" as any} className="rounded-2xl">
          <Plus className="w-4 h-4 mr-2" /> Add Child
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-10">Loading children...</div>
      ) : children.length === 0 ? (
        <div className="card-soft text-center text-muted-foreground py-10">
          No children added yet.
        </div>
      ) : (
        <div className="space-y-6">
          {children.map(child => {
            const childAssessments = assessments.filter(a => a.childId === child._id);
            const latestAssessment = childAssessments[0];
            
            return (
              <div key={child._id} className="card-soft flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary font-heading font-bold text-3xl flex items-center justify-center">
                  C
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-heading font-bold text-foreground">
                    Child (Age {child.age})
                  </h1>
                  <p className="text-muted-foreground">ID: {child._id}</p>
                  <div className="flex gap-2 mt-3">
                    {latestAssessment && (
                      <span className="badge-completed">Latest Score: {latestAssessment.score}%</span>
                    )}
                    <span className="badge-active">{childAssessments.length} assessments</span>
                  </div>
                </div>
                <Link
                  href={`/parent/assessment?childId=${child._id}`}
                  className="btn-accent !px-5 !py-2.5 text-sm"
                >
                  New Assessment
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Assessment History for All Children */}
      <div>
        <h2 className="font-heading font-bold text-lg text-foreground mb-4">
          All Assessments History
        </h2>
        {assessments.length === 0 ? (
          <div className="card-soft text-center text-muted-foreground py-10">
            No assessments taken yet.
          </div>
        ) : (
          <div className="space-y-3">
            {assessments.map((a, i) => (
              <motion.div
                key={a._id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-soft-hover flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground text-sm">
                      AI Screening
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {format(new Date(a.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge-completed">Score: {a.score}%</span>
                  <Link
                    href="/parent/results"
                    className="text-sm text-primary font-semibold hover:underline"
                  >
                    View
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="rounded-[32px] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Child</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAddChild}>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input 
                type="number" 
                min="0"
                max="18"
                required
                value={newChildAge} 
                onChange={(e) => setNewChildAge(e.target.value)}
                className="rounded-2xl" 
              />
            </div>
            <DialogFooter>
              <Button type="button" variant={"outline-primary" as any} onClick={() => setShowAddModal(false)} className="rounded-2xl">Cancel</Button>
              <Button type="submit" disabled={adding} variant={"accent" as any} className="rounded-2xl">
                {adding ? "Adding..." : "Add Child"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
