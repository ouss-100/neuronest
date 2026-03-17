"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Shield,
  Mail,
  Users,
} from "lucide-react";
import { useState } from "react";
import SearchInput from "@/components/admin/SearchInput";
import FilterTabs from "@/components/admin/FilterTabs";
import AvatarBadge from "@/components/admin/AvatarBadge";
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

interface User {
  id: number;
  name: string;
  email: string;
  role: "Parent" | "Doctor" | "Admin";
  status: "active" | "inactive";
  joined: string;
}

const allUsers: User[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Parent",
    status: "active",
    joined: "Jan 15, 2026",
  },
  {
    id: 2,
    name: "Dr. James Smith",
    email: "james@clinic.com",
    role: "Doctor",
    status: "active",
    joined: "Dec 1, 2025",
  },
  {
    id: 3,
    name: "Wei Chen",
    email: "wei@example.com",
    role: "Parent",
    status: "active",
    joined: "Feb 20, 2026",
  },
  {
    id: 4,
    name: "Dr. Lisa Park",
    email: "lisa@hospital.com",
    role: "Doctor",
    status: "inactive",
    joined: "Nov 10, 2025",
  },
  {
    id: 5,
    name: "Ana Martinez",
    email: "ana@example.com",
    role: "Parent",
    status: "active",
    joined: "Mar 5, 2026",
  },
  {
    id: 6,
    name: "Dr. Robert Kim",
    email: "robert@clinic.com",
    role: "Doctor",
    status: "active",
    joined: "Jan 8, 2026",
  },
  {
    id: 7,
    name: "Emily Davis",
    email: "emily@example.com",
    role: "Parent",
    status: "active",
    joined: "Mar 12, 2026",
  },
  {
    id: 8,
    name: "Carlos Rivera",
    email: "carlos@example.com",
    role: "Parent",
    status: "inactive",
    joined: "Oct 22, 2025",
  },
  {
    id: 9,
    name: "Dr. Fatima Ali",
    email: "fatima@hospital.com",
    role: "Doctor",
    status: "active",
    joined: "Feb 14, 2026",
  },
  {
    id: 10,
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Parent",
    status: "active",
    joined: "Mar 1, 2026",
  },
];

const ITEMS_PER_PAGE = 5;

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [users, setUsers] = useState<User[]>(allUsers);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Parents" && u.role === "Parent") ||
      (filter === "Doctors" && u.role === "Doctor");

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u,
      ),
    );

    toast.success("User status updated", {
      description: "The user's account status has been changed.",
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));

    toast.success("User deleted", {
      description: `${deleteTarget.name} has been removed.`,
    });

    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <Toaster />

      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
          User Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage parents, doctors, and administrators
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          placeholder="Search users..."
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />

        <FilterTabs
          tabs={["All", "Parents", "Doctors"]}
          active={filter}
          onChange={(f) => {
            setFilter(f);
            setPage(1);
          }}
        />
      </div>

      {paginated.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try adjusting your search or filter."
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {paginated.map((user, i) => (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className="card-soft !p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-4">
                  <AvatarBadge
                    name={user.name}
                    color={user.role === "Doctor" ? "secondary" : "primary"}
                  />

                  <div>
                    <p className="font-heading font-semibold text-foreground text-sm">
                      {user.name}
                    </p>

                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="badge-active text-xs">{user.role}</span>
                  <StatusBadge status={user.status} />

                  <span className="text-xs text-muted-foreground hidden md:inline">
                    {user.joined}
                  </span>

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
                        <Edit className="w-4 h-4" /> Edit User
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="gap-2 rounded-lg"
                        onClick={() => toggleStatus(user.id)}
                      >
                        {user.status === "active" ? (
                          <>
                            <UserX className="w-4 h-4" /> Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4" /> Activate
                          </>
                        )}
                      </DropdownMenuItem>

                      <DropdownMenuItem className="gap-2 rounded-lg">
                        <Shield className="w-4 h-4" /> Change Role
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="gap-2 rounded-lg text-destructive focus:text-destructive"
                        onClick={() => setDeleteTarget(user)}
                      >
                        <Trash2 className="w-4 h-4" /> Delete User
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
        title="Delete User"
        description={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AdminUsers;
