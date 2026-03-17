interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "published" | "draft" | "completed";
}

const statusStyles: Record<string, string> = {
  active: "badge-completed",
  published: "badge-completed",
  completed: "badge-completed",
  pending: "badge-pending",
  draft: "badge-pending",
  inactive: "bg-destructive/10 text-destructive rounded-full px-4 py-1 text-sm font-bold",
};

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={`${statusStyles[status] || "badge-active"} capitalize text-xs`}>
    {status}
  </span>
);

export default StatusBadge;
