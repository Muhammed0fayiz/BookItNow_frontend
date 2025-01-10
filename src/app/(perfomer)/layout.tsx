'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import axiosInstance from '@/shared/axiousintance';
import { io, Socket } from 'socket.io-client';
import usePerformerStore from '@/store/usePerformerStore';
import useUserStore from '@/store/useUserStore';
import useSocketStore from '@/store/useSocketStore ';
import { NotificationBox } from '@/component/NotificationBox';
import useChatNotifications from '@/store/useChatNotification';
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { userProfile, fetchUserProfile, handleLogout } = useUserStore();
  const { performerDetails, stats, fetchPerformerDetails, handleLogout: storeHandleLogout } = usePerformerStore();
  const { fetchNotifications } = useChatNotifications();
  const { setSocket, disconnectSocket,socket} = useSocketStore();
   const [notifications, setNotifications] = useState<Array<{ bandName: string; profileImage: string; message: string }>>([]);
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
   useEffect(()=>{
   
    if(socket){
    

      socket.on('yougotamsg',async({senderId,message})=>{
        console.log('is',performerDetails?.PId,'is');
      
        fetchNotifications(performerDetails?.PId)
       
        try {
          
          
          const response = await axiosInstance.get(`/getUser/${senderId}`, { withCredentials: true });
          const userData = response.data.response;
          setNotifications(prev => [...prev, {
            bandName: userData.username,
            profileImage: userData.profileImage,
            message: message
          }]);
        } catch (error) {
          console.error('Error fetching performer data:', error);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('yougotamsg');
      }
    };
  }, [socket,performerDetails?.PId, fetchNotifications]);

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
  const removeNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };
  return (
    <div>
      <header>

      </header>
      <main>{children}</main>
      <footer>
     
      </footer>
          <div className="fixed top-4 right-4 z-50">
              {notifications.map((notification, index) => (
                <NotificationBox
                  key={index}
                  bandName={notification.bandName}
                  profileImage={notification.profileImage}
                  message={notification.message}
                  onClose={() => removeNotification(index)}
                />
              ))}
            </div>
    </div>
  );
};

export default Layout;
