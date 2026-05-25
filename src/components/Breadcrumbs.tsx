import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  admin: "Dashboard",
  media: "Media",
  playlists: "Playlists",
  screens: "Screens",
  login: "Login",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-sm text-white/30">
        <li>
          <Link href="/admin" className="hover:text-yugo-accent transition-colors">
            Dashboard
          </Link>
        </li>
        {segments.slice(1).map((seg, i) => {
          const href = "/" + segments.slice(0, i + 2).join("/");
          const label = LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
          const isLast = i === segments.slice(1).length - 1;
          return (
            <li key={href} className="flex items-center gap-1.5">
              <span className="text-white/10">/</span>
              {isLast ? (
                <span className="text-white/60" aria-current="page">{label}</span>
              ) : (
                <Link href={href} className="hover:text-yugo-accent transition-colors">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
