import { motion } from "framer-motion";
import { Search, MoreHorizontal, UserCheck, UserX } from "lucide-react";
import { useState } from "react";

const users = [
  { name: "Sarah Johnson", email: "sarah@example.com", role: "Parent", status: "active", joined: "Jan 15, 2026" },
  { name: "Dr. James Smith", email: "james@clinic.com", role: "Doctor", status: "active", joined: "Dec 1, 2025" },
  { name: "Wei Chen", email: "wei@example.com", role: "Parent", status: "active", joined: "Feb 20, 2026" },
  { name: "Dr. Lisa Park", email: "lisa@hospital.com", role: "Doctor", status: "inactive", joined: "Nov 10, 2025" },
  { name: "Ana Martinez", email: "ana@example.com", role: "Parent", status: "active", joined: "Mar 5, 2026" },
];

const AdminUsers = () => {
  const [filter, setFilter] = useState("All");

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage parents, doctors, and administrators</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input className="input-soft !pl-11" placeholder="Search users..." />
        </div>
        <div className="flex gap-2">
          {["All", "Parents", "Doctors"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-heading font-semibold transition-all ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {users.map((user, i) => (
          <motion.div
            key={user.email}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-soft !p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-heading font-bold flex items-center justify-center">
                {user.name[0]}
              </div>
              <div>
                <p className="font-heading font-semibold text-foreground text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge-active text-xs">{user.role}</span>
              <span className={`flex items-center gap-1 text-xs font-semibold ${user.status === "active" ? "text-secondary" : "text-muted-foreground"}`}>
                {user.status === "active" ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                {user.status}
              </span>
              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
