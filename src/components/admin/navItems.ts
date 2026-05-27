import {
  DashboardIcon,
  MediaIcon,
  PlaylistIcon,
  ScreenIcon,
} from "@/components/icons";
import type { LucideProps } from "lucide-react";
import type { ComponentType } from "react";

export interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<LucideProps>;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: DashboardIcon },
  { label: "Media", href: "/admin/media", icon: MediaIcon },
  { label: "Playlists", href: "/admin/playlists", icon: PlaylistIcon },
  { label: "Screens", href: "/admin/screens", icon: ScreenIcon },
];
