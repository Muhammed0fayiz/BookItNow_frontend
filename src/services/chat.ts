import { Message } from './../types/user';
import { ChatRoom } from './../types/store';
import axiosInstance from "@/shared/axiousintance";
import mongoose from "mongoose";
import { Socket } from "socket.io-client";
export const startChat = async (userId: string, performerId: string) => {
    try {
      await axiosInstance.post(`/chat/chatwithPerformer/${userId}/${performerId}`);
    } catch (error) {
      console.error("Error starting chat:", error);
      throw error;
    }
  };





export const chatService = {
  async updateUserOnlineStatus(userId: string, otherId: string) {
    try {
      await axiosInstance.post(`/chat/onlineUser/${userId}/${otherId}`);
    } catch (error) {
      console.error("Error updating online status:", error);
      throw error;
    }
  },

  async getChatMessages(userId: string, otherId: string): Promise<Message[]> {
    try {
      const response = await axiosInstance.get(`/chat/chat-with/${userId}/${otherId}`);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      throw error;
    }
  },

  async getMessageNotifications(userId: string) {
    try {
      const response = await axiosInstance.get(`/chat/messageNotification/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching message notifications:", error);
      throw error;
    }
  },

  async sendMessage(userId: string, otherId: string, message: string) {
    try {
      await axiosInstance.post(
        `/chat/handleSendMessage/${userId}/${otherId}`,
        { message }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
};


export const chatSocketService = {
  setupMessageListener(
    socket: Socket | null,
    selectedChatRoom: ChatRoom | null,
    onNewMessage: (message: Message) => void
  ) {
    if (!socket || !selectedChatRoom) return;

    socket.on("receiveMessage", ({ senderId, message }) => {
      if (selectedChatRoom.otherId === senderId) {
        const newMessage: Message = {
          _id: new mongoose.Types.ObjectId().toString(),
          roomId: selectedChatRoom.otherId,
          senderId: new mongoose.Types.ObjectId(senderId),
          receiverId: new mongoose.Types.ObjectId(selectedChatRoom.myId),
          message: message,
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
          role: "receiver",
        };
        onNewMessage(newMessage);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  },

  emitMessage(
    socket: Socket | null,
    senderId: string,
    receiverId: string,
    message: string
  ) {
    if (!socket) return;
    
    socket.emit("sendMessage", {
      senderId,
      receiverId,
      message,
    });
  }
};


