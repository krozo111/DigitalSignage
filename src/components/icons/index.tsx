import {
  LayoutDashboard,
  Image as LucideImage,
  ListMusic,
  Monitor,
  LogOut,
  Trash2,
  GripVertical,
  X,
  Link as LucideLink,
  AlertTriangle,
  Inbox,
  Rocket,
  Menu,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

const wrap = (Source: LucideIcon) => {
  const Component = (props: LucideProps) => (
    <Source strokeWidth={1.5} size={20} {...props} />
  );
  Component.displayName = Source.displayName;
  return Component;
};

export const DashboardIcon = wrap(LayoutDashboard);
export const MediaIcon = wrap(LucideImage);
export const PlaylistIcon = wrap(ListMusic);
export const ScreenIcon = wrap(Monitor);
export const LogoutIcon = wrap(LogOut);
export const TrashIcon = wrap(Trash2);
export const DragHandleIcon = wrap(GripVertical);
export const CloseIcon = wrap(X);
export const LinkIcon = wrap(LucideLink);
export const AlertIcon = wrap(AlertTriangle);
export const EmptyIcon = wrap(Inbox);
export const RocketIcon = wrap(Rocket);
export const MenuIcon = wrap(Menu);
export const ChevronLeftIcon = wrap(ChevronLeft);
export const ChevronRightIcon = wrap(ChevronRight);
