import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useUserStore from '@/store/useUserStore';
import { loginImage } from '@/datas/logindatas';
import Image from "next/image";
import {
  Calendar,
  Heart,
  Wallet,
  History,
  LogOut,
  User,
  Home
} from 'lucide-react';

const Sidebar: React.FC<{ sidebarOpen: boolean; toggleSidebar: () => void; handleLogout: () => void; }> = ({ 
  sidebarOpen, 
  handleLogout 
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userProfile } = useUserStore();

  const handleProfileClick = () => {
    router.replace('/profile');
  };

  const navigationItems = [
    {
      path: '/profile',
      icon: <User size={20} />,
      label: 'My Profile'
    },
    {
      path: '/upcoming-events',
      icon: <Calendar size={20} />,
      label: 'Upcoming Events'
    },
    {
      path: '/event-history',
      icon: <History size={20} />,
      label: 'Event History'
    },
    {
      path: '/favorite-events',
      icon: <Heart size={20} />,
      label: 'Favorite Events'
    },
    {
      path: '/user-wallet',
      icon: <Wallet size={20} />,
      label: 'My Wallet'
    },
    {
      path: '/home',
      icon: <Home size={20} />,
      label: 'Home Page'
    }
  ];

  return (
    <aside 
      className={`w-64 bg-blue-600 text-white p-6 fixed top-0 left-0 h-full transition-transform duration-300 z-40 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 pt-24`}
    >
      <div 
        className="flex items-center mb-8 cursor-pointer hover:bg-blue-700 p-2 rounded"
        onClick={handleProfileClick}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white mr-3">
       <Image
            src={userProfile?.profileImage || loginImage.img}
            alt="User Avatar"
            className="w-full h-full object-cover"
            width={50}
            height={30}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = loginImage.img;
            }}
          />
        </div>
        <div>
          <h3 className="text-md font-semibold">{userProfile?.username || 'Guest'}</h3>
          <span className="text-sm font-light">User</span>
        </div>
      </div>

      <ul className="space-y-4">
        {navigationItems.map((item) => (
          <li key={item.path}>
            <button
              onClick={() => router.push(item.path)}
              className={`flex items-center text-lg p-3 rounded w-full text-left transition-colors duration-200
                ${pathname === item.path 
                  ? 'bg-white text-blue-600 font-medium shadow-lg' 
                  : 'hover:bg-blue-700 text-white/90'
                }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          </li>
        ))}
        <li>
          <button 
            onClick={handleLogout}
            className="flex items-center text-lg hover:bg-blue-700 p-3 rounded w-full text-left text-red-200"
          >
            <LogOut className="mr-2" size={20} />
            Sign Out
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;