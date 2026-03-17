import DashboardClient from "@/components/DashboardClient";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardClient role="admin">
      {children} <Toaster />
    </DashboardClient>
  );
}
