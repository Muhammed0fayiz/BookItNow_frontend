"use client";
import React, { ReactNode, useEffect, useState } from "react";
import axiosInstance from "@/shared/axiousintance";
import useUserStore from "@/store/useUserStore";
import { io } from "socket.io-client";
import useChatNotifications from "@/store/useChatNotification";
import { NotificationBox } from "@/component/NotificationBox";
import useSocketStore from "@/store/useSocketStore ";

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
    if (socket) {
      socket.on("yougotamsg", async ({ senderId, message }) => {
        fetchNotifications(userProfile?.id);
        try {
          const isOnline = await axiosInstance.get(
            `/chat/checkOnline/${senderId}/${userProfile?.id}`
          );

          console.log("id", isOnline.data.onlineUser);
          if (isOnline.data.onlineUser == false) {
            const response = await axiosInstance.get(
              `/performer/getPerformer/${senderId}`,
              { withCredentials: true }
            );
            const performerData = response.data.response;

            // Update notifications
            setNotifications((prev) => [
              ...prev,
              {
                bandName: performerData.bandName,
                profileImage: performerData.profileImage,
                message: message,
              },
            ]);
          } else {
            console.log("User is online. Skipping performer data fetch.");
          }
        } catch (error) {
          console.error("Error fetching performer data:", error);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("yougotamsg");
      }
    };
  }, [socket, userProfile?.id, fetchNotifications]);

  useEffect(() => {
    const updateUserStatus = async () => {
      try {
        if (userProfile?.id) {
          await axiosInstance.post(`/chat/offlineUser/${userProfile.id}`);
        }
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    };

    updateUserStatus();
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
