'use client';
import React, { ReactNode, useEffect } from 'react';
import axiosInstance from '@/shared/axiousintance';
import { io, Socket } from 'socket.io-client';
import usePerformerStore from '@/store/usePerformerStore';
import useUserStore from '@/store/useUserStore';
import useSocketStore from '@/store/useSocketStore ';
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { userProfile, fetchUserProfile, handleLogout } = useUserStore();
  const { performerDetails, stats, fetchPerformerDetails, handleLogout: storeHandleLogout } = usePerformerStore();
  const { setSocket, disconnectSocket } = useSocketStore();
  useEffect(() => {
     const socket = io('http://localhost:5000', { withCredentials: true });
      console.log(":😘 ",performerDetails?.PId)
     if (performerDetails?.PId) {
       socket.emit('userConnected', performerDetails?.PId)
     }
 
     // Store socket in Zustand
     setSocket(socket);
 
     // Clean up on unmount
     return () => {
       disconnectSocket();
     };
   }, [performerDetails?.PId, setSocket, disconnectSocket]);
  useEffect(() => {
    const updateUserStatus = async () => {
      try {
        if (performerDetails?.PId) {
          await axiosInstance.post(`/offlineUser/${performerDetails.PId}`);
          console.log('hel',performerDetails.PId)
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
