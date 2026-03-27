"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase.config";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Media", href: "/admin/media", icon: "🖼️" },
    { label: "Playlists", href: "/admin/playlists", icon: "📋" },
    { label: "Screens", href: "/admin/screens", icon: "🖥️" },
  ];

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, loading, pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-yugo-primary text-white">
        <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-yugo-accent mr-4"></span>
        <span className="text-xl font-medium">Verifying access...</span>
      </div>
    );
  }

  if (!user) {
    return null; // Prevents any UI flash before the useEffect redirect kicks in
  }

  return (
    <div className="flex h-screen bg-yugo-primary text-white flex-col md:flex-row">
      {/* Sidebar (Desktop) / Topbar (Mobile) */}
      <aside className="w-full md:w-64 bg-yugo-primary/50 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between backdrop-blur-sm">
        <div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-yugo-accent">Yugo</span> Admin
            </h1>
            <p className="text-xs text-white/40 mt-1 truncate">{user?.email}</p>
          </div>
          <nav className="flex md:flex-col gap-1 px-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-yugo-accent/10 text-yugo-accent font-medium border-l-2 border-yugo-accent rounded-none"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Logout (Hidden on small mobile scroll, visible at end) */}
        <div className="p-4 hidden md:block">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-3"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Logout (Bottom) */}
      <div className="md:hidden border-t border-white/5 p-2 bg-yugo-primary/80">
        <button
          onClick={handleLogout}
          className="w-full text-center py-3 text-red-400 font-medium active:bg-red-500/10 rounded-lg transition-colors"
        >
           Logout
        </button>
      </div>
    </div>
  );
}
