import type { UserRole } from '@/contexts/types';

interface HeaderProps {
  onToggleSidebar: () => void;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  roles: string[];
}

export type {
  HeaderProps, //
  SidebarProps,
  MenuItem,
};
