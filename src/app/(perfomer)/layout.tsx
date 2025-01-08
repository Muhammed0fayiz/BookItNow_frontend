'use client';
import React, { ReactNode, useEffect } from 'react';
import axiosInstance from '@/shared/axiousintance';

import usePerformerStore from '@/store/usePerformerStore';
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  
  const { performerDetails, stats, fetchPerformerDetails, handleLogout: storeHandleLogout } = usePerformerStore();
 
  useEffect(() => {
    const updateUserStatus = async () => {
      try {
        if (performerDetails?.PId) {
          await axiosInstance.post(`/offlineUser/${performerDetails.PId}`);
        }
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    };

    updateUserStatus();
  }, [performerDetails?.PId]); 

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
