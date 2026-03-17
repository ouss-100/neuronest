"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import SearchInput from "@/components/admin/SearchInput";
import FilterTabs from "@/components/admin/FilterTabs";
import StatusBadge from "@/components/admin/StatusBadge";
import Pagination from "@/components/admin/Pagination";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import EmptyState from "@/components/admin/EmptyState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface Article {
  id: number;
  title: string;
  type: string;
  status: "published" | "draft";
  date: string;
  author: string;
}

const initialContent: Article[] = [
  {
    id: 1,
    title: "Signs Your Child May Have a Learning Disorder",
    type: "Article",
    status: "published",
    date: "Mar 10, 2026",
    author: "Dr. Smith",
  },
  {
    id: 2,
    title: "Understanding Dyslexia: A Parent's Guide",
    type: "Guide",
    status: "published",
    date: "Mar 5, 2026",
    author: "LearnBright Team",
  },
  {
    id: 3,
    title: "ADHD Support Strategies for Schools",
    type: "Article",
    status: "draft",
    date: "Mar 12, 2026",
    author: "Dr. Park",
  },
  {
    id: 4,
    title: "Building Confidence in Struggling Learners",
    type: "Tips",
    status: "published",
    date: "Feb 28, 2026",
    author: "LearnBright Team",
  },
  {
    id: 5,
    title: "How AI is Transforming Early Detection",
    type: "Article",
    status: "published",
    date: "Feb 20, 2026",
    author: "Research Dept.",
  },
  {
    id: 6,
    title: "Dyscalculia: What Parents Need to Know",
    type: "Guide",
    status: "draft",
    date: "Mar 14, 2026",
    author: "Dr. Kim",
  },
  {
    id: 7,
    title: "Inclusive Classroom Activities",
    type: "Tips",
    status: "published",
    date: "Feb 15, 2026",
    author: "LearnBright Team",
  },
  {
    id: 8,
    title: "When to Seek Professional Help",
    type: "Article",
    status: "published",
    date: "Jan 30, 2026",
    author: "Dr. Ali",
  },
];

const ITEMS_PER_PAGE = 5;

const AdminContent = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [articles, setArticles] = useState<Article[]>(initialContent);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  const filtered = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "Published" && a.status === "published") ||
      (filter === "Drafts" && a.status === "draft");
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const toggleStatus = (id: number) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "published" ? "draft" : "published" }
          : a,
      ),
    );

    toast.success("Status updated", {
      description: "Article status has been changed.",
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    toast.success("Article deleted", {
      description: `"${deleteTarget.title}" has been removed.`,
    });
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <Toaster />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          placeholder="Search articles..."
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />
        <FilterTabs
          tabs={["All", "Published", "Drafts"]}
          active={filter}
          onChange={(f) => {
            setFilter(f);
            setPage(1);
          }}
        />
      </div>

      {paginated.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No articles found"
          description="Try adjusting your search or create a new article."
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {paginated.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className="card-soft !p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground text-sm">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.type} • {item.author} • {item.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded-xl hover:bg-muted transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl w-48"
                    >
                      <DropdownMenuItem className="gap-2 rounded-lg">
                        <Eye className="w-4 h-4" /> Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 rounded-lg">
                        <Edit className="w-4 h-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 rounded-lg"
                        onClick={() => toggleStatus(item.id)}
                      >
                        {item.status === "published" ? "Unpublish" : "Publish"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="gap-2 rounded-lg text-destructive focus:text-destructive"
                        onClick={() => setDeleteTarget(item)}
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Article"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AdminContent;
