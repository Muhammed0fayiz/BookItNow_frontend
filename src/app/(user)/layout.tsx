'use client';
import React, { ReactNode, useEffect } from 'react';
import axiosInstance from '@/shared/axiousintance';
import useUserStore from '@/store/useUserStore';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { userProfile, fetchUserProfile, handleLogout } = useUserStore();

  useEffect(() => {
    const updateUserStatus = async () => {
      try {
        if (userProfile?.id) {
          await axiosInstance.post(`/offlineUser/${userProfile.id}`);
        }
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    };

    updateUserStatus();
  }, [userProfile?.id]); 

  return (
    <div>
      <header>
 
      </header>
      <main>{children}</main>
      <footer>
    
      </footer>
    </div>
  );
};

export default Layout;
