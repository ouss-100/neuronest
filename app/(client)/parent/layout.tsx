import DashboardClient from "@/components/DashboardClient";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClient role="parent">{children}</DashboardClient>;
}