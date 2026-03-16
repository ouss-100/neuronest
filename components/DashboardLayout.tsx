import { headers } from "next/headers";
import DashboardClient from "./DashboardClient";

type Role = "parent" | "doctor" | "admin";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  let role: Role = "parent";

  if (pathname.startsWith("/doctor")) role = "doctor";
  if (pathname.startsWith("/admin")) role = "admin";

  return <DashboardClient role={role}>{children}</DashboardClient>;
}
