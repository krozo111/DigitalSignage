import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAdminSession } from "@/lib/auth/session";
import { AdminShell } from "./AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";

  // The login page itself must remain accessible without a session
  if (pathname.endsWith("/admin/login")) {
    return <>{children}</>;
  }

  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell serverEmail={session.email}>{children}</AdminShell>;
}
