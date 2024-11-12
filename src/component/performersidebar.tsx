import React from 'react';
import { LayoutDashboard, Calendar, Clock, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { loginpefomer } from '@/datas/logindatas';

interface SidebarProps {
  isOpen: boolean;
  performerDetails: {
    image: string;
    bandName?: string;
    imageUrl?: string;
  } | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, performerDetails, onLogout }) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const navigationItems = [
    {
      path: '/performer-dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard'
    },
    {
      path: '/event-management',
      icon: <Calendar size={20} />,
      label: 'Events Details'
    },
    {
      path: '/slot-management',
      icon: <Clock size={20} />,
      label: 'Slot Management'
    },
    {
      path: '/upcoming-events',
      icon: <Calendar size={20} />,
      label: 'Upcoming Events'
    },
    {
      path: '/event-history',
      icon: <Clock size={20} />,
      label: 'Event History'
    }
  ];

  return (
    <aside 
      className={`w-64 bg-blue-600 text-white p-6 fixed top-0 left-0 h-full transition-transform duration-300 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-20`}
    >
      {/* Performer Profile Section */}
      <div
        className="flex items-center mb-8 cursor-pointer hover:bg-blue-700 p-2 rounded"
        onClick={() => handleNavigation('/performer-profile')}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white mr-3 relative">
          {performerDetails?.imageUrl ? (
             <img
             src={performerDetails?.imageUrl|| performerDetails?.image || "http://i.pravatar.cc/250?img=58"}
             alt={performerDetails?.bandName || 'Profile Image'}
             className="object-cover w-full h-full"
           />
          ) : (
            <img
              src={performerDetails?.imageUrl|| performerDetails?.image || "http://i.pravatar.cc/250?img=58"}
              alt={performerDetails?.bandName || 'Profile Image'}
              className="object-cover w-full h-full"
            />
          )}
        </div>
        <div>
          <img src="performerDetail." alt="" />
          <h3 className="text-md font-semibold">
            {performerDetails?.bandName || 'Welcome Back'}
          </h3>
          <span className="text-sm font-light">Performer</span>
        </div>
      </div>

      {/* Navigation Links */}
      <ul className="space-y-4">
        {navigationItems.map((item) => (
          <li key={item.path}>
            <button
              onClick={() => handleNavigation(item.path)}
              className="flex items-center text-lg hover:bg-blue-700 p-3 rounded w-full text-left"
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={onLogout}
            className="flex items-center text-lg hover:bg-blue-700 p-3 rounded w-full text-left text-red-200"
          >
            <LogOut className="mr-2" size={20} />
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;