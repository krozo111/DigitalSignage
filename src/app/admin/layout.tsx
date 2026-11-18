import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import { AdminShell } from "./AdminShell";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session-constants";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  // Keep the public login page outside the Firebase Admin SDK branch. The
  // server-side redirect below is defense in depth if the proxy is bypassed.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!sessionCookie) redirect("/admin/login");

  const { getAdminSession } = await import("@/lib/auth/session");
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell serverEmail={session.email}>{children}</AdminShell>;
}
