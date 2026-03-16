"use client";

import { motion } from "framer-motion";
import { FileText, Plus, Edit, Trash2, Eye } from "lucide-react";

const content = [
  {
    title: "Signs Your Child May Have a Learning Disorder",
    type: "Article",
    status: "published",
    date: "Mar 10, 2026",
  },
  {
    title: "Understanding Dyslexia: A Parent's Guide",
    type: "Guide",
    status: "published",
    date: "Mar 5, 2026",
  },
  {
    title: "ADHD Support Strategies",
    type: "Article",
    status: "draft",
    date: "Mar 12, 2026",
  },
  {
    title: "Building Confidence in Struggling Learners",
    type: "Tips",
    status: "published",
    date: "Feb 28, 2026",
  },
];

const AdminContent = () => (
  <div className="space-y-6 max-w-5xl">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
          Content Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage articles, guides, and resources
        </p>
      </div>
      <button className="btn-accent !px-5 !py-2.5 text-sm flex items-center gap-1.5">
        <Plus className="w-4 h-4" /> New Article
      </button>
    </div>

    <div className="space-y-2">
      {content.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="card-soft !p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-semibold text-foreground text-sm">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.type} • {item.date}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={
                item.status === "published"
                  ? "badge-completed"
                  : "badge-pending"
              }
            >
              {item.status}
            </span>
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Eye className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Edit className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default AdminContent;
