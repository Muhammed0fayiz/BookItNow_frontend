'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import useChatNotifications from '@/store/useChatNotification';

interface NavbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  pageTitle?: string;  // Add optional pageTitle prop
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, toggleSidebar, pageTitle }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { totalUnreadMessage } = useChatNotifications();

  // Default title logic
  const getPageTitle = () => {
    if (pageTitle) return pageTitle;
    
    const path = pathname?.toLowerCase();
    switch (path) {
      case '/eventhistory':
        return 'Event History';
      case '/favorites':
      case '/fav':
        return 'Favorite Events';
      default:
        return 'Dashboard';
    }
  };

  return (
    <nav className="bg-white shadow-sm h-16 fixed right-0 left-0 md:left-64 z-40">
      <div className="px-4 h-full flex justify-between items-center">
        {/* Left Side: Menu Button (visible only on mobile) */}
        <div className="flex items-center space-x-4 md:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Center: Page Title */}
        <div className="flex-1 flex justify-center">
        <h1 className="text-xl font-semibold text-blue-600">
  BookItNow
</h1>

        </div>

        {/* Right Side: Chat Icon */}
        <div className="flex items-center space-x-4">
          <a href="/chat" className="relative text-gray-700 hover:text-blue-600 transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2z" />
            </svg>
            {totalUnreadMessage > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {totalUnreadMessage}
              </span>
            )}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;