import DashboardClient from "@/components/DashboardClient";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClient role="doctor">{children}</DashboardClient>;
}