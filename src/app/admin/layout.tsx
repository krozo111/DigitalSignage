import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import { AdminShell } from "./AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  const sessionCookie = (await cookies()).get("admin-session")?.value;

  // The login page and all requests without a session must not load the
  // Firebase Admin SDK. Netlify bundles that server-only dependency into the
  // function; keeping it behind the authenticated branch prevents a public
  // login request from failing before the client can sign in. The proxy owns
  // the UX redirect for protected /admin routes without this cookie.
  if (pathname.endsWith("/admin/login") || !sessionCookie) {
    return <>{children}</>;
  }

  const { getAdminSession } = await import("@/lib/auth/session");
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell serverEmail={session.email}>{children}</AdminShell>;
}
