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
  { label: "Home", href: "/admin", icon: DashboardIcon },
  { label: "Media", href: "/admin/media", icon: MediaIcon },
  { label: "Playlists", href: "/admin/playlists", icon: PlaylistIcon },
  { label: "Screens", href: "/admin/screens", icon: ScreenIcon },
];

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  { label: "Overview", items: [NAV_ITEMS[0]] },
  { label: "Content operations", items: NAV_ITEMS.slice(1, 3) },
  { label: "Screen operations", items: [NAV_ITEMS[3]] },
];
