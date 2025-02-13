"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useUserStore from "@/store/useUserStore";
import useChatNotifications from "@/store/useChatNotification";
import { NotificationBox } from "@/component/NotificationBox";
import useSocketStore from "@/store/useSocketStore";
import { checkOnlineStatus, markUserOffline } from "@/services/chat";
import { getPerformerDetails } from "@/services/performer";
// import { checkOnlineStatus, getPerformerDetails, markUserOffline } from "@/services/chatService";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { userProfile } = useUserStore();
  const { setSocket, disconnectSocket, socket } = useSocketStore();
  const { fetchNotifications } = useChatNotifications();
  const [notifications, setNotifications] = useState<
    Array<{ bandName: string; profileImage: string; message: string }>
  >([]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", { withCredentials: true });

    if (userProfile?.id) {
      newSocket.emit("userConnected", userProfile.id);
    }

    setSocket(newSocket);

    return () => {
      disconnectSocket();
    };
  }, [userProfile?.id, setSocket, disconnectSocket]);

  useEffect(() => {
    if (!socket || !userProfile?.id) return;
  
    socket.on("yougotamsg", async ({ senderId, message }) => {
      fetchNotifications(userProfile.id);
      
      const isOnline = await checkOnlineStatus(senderId, userProfile.id);
  
      if (!isOnline) {
        const performerData = await getPerformerDetails(senderId);
        if (performerData) {
          setNotifications((prev) => [
            ...prev,
            {
              bandName: performerData.bandName,
              profileImage: performerData.profileImage,
              message: message,
            },
          ]);
        }
      } else {
        console.log("User is online. Skipping performer data fetch.");
      }
    });
  
    return () => {
      socket.off("yougotamsg");
    };
  }, [socket, userProfile?.id, fetchNotifications]);
  
  useEffect(() => {
    if (userProfile?.id) {
      markUserOffline(userProfile.id);
    }
  }, [userProfile?.id]);

  const removeNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="relative min-h-screen">
      <header>{/* Header content */}</header>
      <main>{children}</main>
      <footer>{/* Footer content */}</footer>
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
