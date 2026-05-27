"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { UnsavedChangesProvider } from "@/context/UnsavedChangesContext";
import { auth } from "@/lib/firebase.config";
import { MobileDrawer } from "@/components/admin/MobileDrawer";
import { MobileTopBar } from "@/components/admin/MobileTopBar";
import { NAV_ITEMS } from "@/components/admin/navItems";
import { Sidebar } from "@/components/admin/Sidebar";
import { useSidebarCollapsed } from "@/components/admin/useSidebarCollapsed";

interface AdminShellProps {
  children: React.ReactNode;
  serverEmail: string;
}

export function AdminShell({ children, serverEmail }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { collapsed, toggle } = useSidebarCollapsed();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
    } catch {}
    await signOut(auth);
    router.push("/admin/login");
  };

  // If Firebase client-side auth gets out of sync with the server session
  // (e.g. token revoked elsewhere), force re-login.
  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, loading, pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const email = user?.email ?? serverEmail;

  return (
    <UnsavedChangesProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-accent focus:text-on-accent focus:text-label focus:font-semibold focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-[0_8px_24px_-8px_oklch(0_0_0/0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Skip to main content
      </a>
      <div className="flex h-screen text-fg flex-col md:flex-row">
        <Sidebar
          collapsed={collapsed}
          onToggle={toggle}
          email={email}
          onLogout={handleLogout}
          navItems={NAV_ITEMS}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <MobileTopBar
            email={email}
            onLogout={handleLogout}
            onOpenDrawer={() => setDrawerOpen(true)}
          />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 overflow-y-auto px-4 py-6 md:px-10 md:py-10 focus:outline-none"
          >
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>
        </div>

        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          navItems={NAV_ITEMS}
        />
      </div>
    </UnsavedChangesProvider>
  );
}
