import DashboardClient from "@/components/DashboardClient";
import { Toaster } from "@/components/ui/sonner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import getSession from "@/lib/getSession";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getSession();
  const role = session?.user.role || "parent"; // default fallback
  return (
    <DashboardClient role={role}>
      {children} <Toaster />
    </DashboardClient>
  );
}
