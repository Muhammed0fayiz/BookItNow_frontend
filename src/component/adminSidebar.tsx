'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faLock, faSignOutAlt, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MenuItem, SidebarProps } from '../types/sidebar';

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, handleLogout }) => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { icon: faHome, text: 'Dashboard', href: '/dashboard' },
    { icon: faUsers, text: 'User Management', href: '/usermanagement' },
    { icon: faUsers, text: 'Events', href: '/eventmanagement' },
    { icon: faLock, text: 'Verification', href: '/verification' },
    { icon: faChartLine, text: 'Revenue', href: '/revenuemanagement' }
  ];

  const isActiveRoute = (href: string): boolean => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside 
      className={`w-64 bg-blue-600 text-white p-6 h-screen fixed top-0 left-0 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 z-30`}
    >
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-300 mr-3">
          <img
            src="/api/placeholder/48/48"
            alt="Admin"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-blue-100">Admin Name</h3>
          <span className="text-sm font-light text-blue-200">Administrator</span>
        </div>
      </div>

      <nav>
        <ul className="space-y-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link 
                href={item.href} 
                className={`flex items-center text-lg p-3 rounded-lg transition-colors duration-200 ${
                  isActiveRoute(item.href)
                    ? 'bg-blue-50 text-blue-800 font-medium shadow-md' 
                    : 'hover:bg-blue-500 hover:shadow-sm'
                }`}
              >
                 <FontAwesomeIcon 
                  icon={item.icon} 
                  className={`mr-3 ${
                    isActiveRoute(item.href) 
                      ? 'text-blue-600' 
                      : 'text-blue-100'
                  }`}
                />
                {item.text}
              </Link>
            </li>
          ))}
          <li>
            <button 
              onClick={handleLogout} 
              className="w-full text-left flex items-center text-lg hover:bg-blue-500 p-3 rounded-lg transition-colors duration-200 hover:shadow-sm"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-blue-100" />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;