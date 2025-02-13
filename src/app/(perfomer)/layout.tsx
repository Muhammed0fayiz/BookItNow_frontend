'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import usePerformerStore from '@/store/usePerformerStore';
import useSocketStore from '@/store/useSocketStore';
import { NotificationBox } from '@/component/NotificationBox';
import useChatNotifications from '@/store/useChatNotification';
import { checkUserOnline, updateOfflineStatus } from '@/services/chat';
import { getUserDetails } from '@/services/user';


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { performerDetails } = usePerformerStore();
  const { fetchNotifications } = useChatNotifications();
  const { setSocket, disconnectSocket, socket } = useSocketStore();
  const [notifications, setNotifications] = useState<Array<{ bandName: string; profileImage: string; message: string }>>([]);

  useEffect(() => {
    const socket = io('http://localhost:5000', { withCredentials: true });

    if (performerDetails?.PId) {
      socket.emit('userConnected', performerDetails.PId);
    }

    // Store socket in Zustand
    setSocket(socket);

    // Clean up on unmount
    return () => {
      disconnectSocket();
    };
  }, [performerDetails?.PId, setSocket, disconnectSocket]);

  useEffect(() => {
    if (socket) {
      socket.on('yougotamsg', async ({ senderId, message }) => {
        fetchNotifications(performerDetails?.PId);

        try {
          const isOnline = await checkUserOnline(senderId, performerDetails?.PId);

          if (!isOnline) {
            const userData = await getUserDetails(senderId);
            if (userData) {
              setNotifications(prev => [...prev, {
                bandName: userData.username,
                profileImage: userData.profileImage,
                message: message
              }]);
            }
          } else {
            console.log("User is online. Skipping performer data fetch.");
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('yougotamsg');
      }
    };
  }, [socket, performerDetails?.PId, fetchNotifications]);

  useEffect(() => {
    updateOfflineStatus(performerDetails?.PId);
  }, [performerDetails?.PId]);

  const removeNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <header></header>
      <main>{children}</main>
      <footer></footer>
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
