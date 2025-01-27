// types/sidebar.ts
export interface MenuItem {
    icon: any; // FontAwesome icon type
    text: string;
    href: string;
  }
  
  export interface SidebarProps {
    sidebarOpen: boolean;
    handleLogout: () => Promise<void>;
  }