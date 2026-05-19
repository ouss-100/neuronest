"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import SearchInput from "@/components/admin/SearchInput";
import FilterTabs from "@/components/admin/FilterTabs";
import AvatarBadge from "@/components/admin/AvatarBadge";
import StatusBadge from "@/components/admin/StatusBadge";
import Pagination from "@/components/admin/Pagination";
import EmptyState from "@/components/admin/EmptyState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { getAllUsers, toggleUserStatus } from "@/server/adminActions";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Parent" | "Doctor" | "Admin";
  status: "active" | "inactive";
  joined: string;
}

const ITEMS_PER_PAGE = 5;

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getAllUsers();
        if (res.success && res.users) {
          const mappedUsers: User[] = res.users.map((u: any) => ({
            id: u._id,
            name: `${u.firstname || ""} ${u.lastname || ""}`.trim(),
            email: u.email,
            role:
              u.role === "ADMIN" || u.role === "admin"
                ? "Admin"
                : u.role === "DOCTOR" || u.role === "doctor"
                  ? "Doctor"
                  : "Parent",
            status: u.isActive ? "active" : "inactive",
            joined: u.createdAt
              ? new Date(u.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
              : "Unknown",
          }));
          setUsers(mappedUsers);
        } else {
          toast.error("Failed to load users", {
            description: res.message || "An error occurred while fetching users.",
          });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users", {
          description: "An unexpected error occurred.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  const toggleStatus = async (id: string) => {
    const res = await toggleUserStatus(id);
    if (res.success) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, status: u.status === "active" ? "inactive" : "active" }
            : u,
        ),
      );

      toast.success("User status updated", {
        description: res.message || "The user's account status has been changed.",
      });
    } else {
      toast.error("Failed to update status", {
        description: res.message || "An error occurred while updating status.",
      });
    }
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

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="card-soft !p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="space-y-2 flex-1 sm:flex-none">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-48 bg-muted rounded" />
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="h-5 w-16 bg-muted rounded-full" />
                <div className="h-5 w-16 bg-muted rounded-full" />
                <div className="h-3 w-20 bg-muted rounded hidden md:block" />
                <div className="w-8 h-8 rounded-xl bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : paginated.length === 0 ? (
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
    </div>
  );
};

export default AdminUsers;
