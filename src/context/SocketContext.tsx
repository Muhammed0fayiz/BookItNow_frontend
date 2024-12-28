import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

// Define the shape of the context
interface SocketContextType {
  socket: Socket | null;
  messages: Message[];
  sendMessage: (receiverId: string, message: string) => void;
}

// Define the shape of a message
interface Message {
  senderId: string;
  receiverId: string;
  message: string;
}

// Create the context with a default value of null
export const SocketContext = createContext<SocketContextType | null>(null);

// Create a hook to use the context
export const useSocketContext = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketContextProvider");
  }
  return context;
};

// Define the props for the provider
interface SocketContextProviderProps {
  children: ReactNode;
}

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const socketInstance = io("http://localhost:5000", {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected!");
    
      const userId = localStorage.getItem("userId"); // Get userId from localStorage
      console.log(userId,'is')
      if (userId) {
        socketInstance.emit("userConnected", userId);
      }
      console.log("User ID:", userId);
    });



    socketInstance.on("receiveMessage", (newMessage: Message) => {
      console.log("New message received:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    });

    setSocket(socketInstance);

    // Cleanup function to remove event listeners and disconnect the socket
    return () => {
      socketInstance.off("connect");
      socketInstance.off("getOnlineUsers");
      socketInstance.off("receiveMessage");
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = (receiverId: string, message: string) => {
    if (socket) {
      const messageData: Message = {
        senderId: localStorage.getItem("userId") || "", // Get senderId from localStorage
        receiverId,
        message,
      };
      socket.emit("sendMessage", messageData);
    }
  };

  return (
    <SocketContext.Provider value={{ socket,messages, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
