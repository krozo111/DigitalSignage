"use client";

import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { UnsavedChangesProvider } from "@/context/UnsavedChangesContext";
import { MobileTabBar } from "@/components/admin/MobileTabBar";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopBar } from "@/components/admin/TopBar";
import { NAV_GROUPS, NAV_ITEMS } from "@/components/admin/navItems";

interface AdminShellProps {
  children: React.ReactNode;
  serverEmail: string;
}

export function AdminShell({ children, serverEmail }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Could not safely end your session. Check your connection and try again.");
    }
  };

  // Route protection is owned by the server (proxy + the admin layout's
  // getAdminSession check). We deliberately do NOT redirect based on the
  // Firebase client `user`: a transient null (token refresh, App Check hiccup,
  // multi-tab) would otherwise fight the proxy and bounce the admin
  // between /admin and /admin/login. The httpOnly session cookie is the source
  // of truth; genuine revocation is caught server-side on the next navigation.

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <main aria-busy="true" className="flex min-h-screen items-center justify-center bg-background text-fg-muted">
        <p role="status" className="text-label">Restoring your secure session…</p>
      </main>
    );
  }

  if (!user || user.email?.toLowerCase() !== serverEmail.toLowerCase()) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-fg">
        <h1 className="text-h2">Your admin session needs to be restored</h1>
        <p className="max-w-md text-label text-fg-muted">Sign in again to safely reconnect this browser to the admin account.</p>
        <button type="button" onClick={handleLogout} className="rounded-md bg-accent px-4 py-2 text-label font-semibold text-on-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-mint">Return to sign in</button>
      </main>
    );
  }

  const email = user?.email ?? serverEmail;

  return (
    <UnsavedChangesProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-accent focus:text-on-accent focus:text-label focus:font-semibold focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-mint focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Skip to main content
      </a>
      <div className="flex h-screen text-fg">
        <Sidebar groups={NAV_GROUPS} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar email={email} onLogout={handleLogout} />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 overflow-y-auto px-4 py-6 pb-24 md:px-8 md:py-8 lg:pb-8 focus:outline-none"
          >
            <div className="mx-auto max-w-[1400px]">{children}</div>
          </main>
          <MobileTabBar navItems={NAV_ITEMS} email={email} onLogout={handleLogout} />
        </div>
      </div>
    </UnsavedChangesProvider>
  );
}
