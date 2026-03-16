import DashboardClient from "@/components/DashboardClient";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClient role="admin">{children}</DashboardClient>;
}
