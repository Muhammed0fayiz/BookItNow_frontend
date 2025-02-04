import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface MenuItem {
  icon: IconDefinition; 
  text: string;
  href: string;
}

export interface SidebarProps {
  sidebarOpen: boolean;
  handleLogout: () => Promise<void>;
}
