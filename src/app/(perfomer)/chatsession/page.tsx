'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import mongoose from 'mongoose';
import { Menu, MessageCircle, Send, Search } from 'lucide-react';
// import axiosInstance from '@/shared/axiousintance';
import usePerformerStore from '@/store/usePerformerStore';
import { useUIStore } from '@/store/useUIStore';
import Sidebar from '@/component/performersidebar';
import useChatRooms from '@/store/chatstore';
import useChatNotifications from '@/store/useChatNotification';
import useSocketStore from '@/store/useSocketStore';
import { chatService, chatSocketService } from "@/services/chat";

export interface ChatRoom {
  profileImage: string;
  userName: string;
  performerName: string; 
  myId: string;
  otherId: string;
}

interface Message {
  _id: string;
  roomId: string;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  role?: string;
}

// interface OnlineStatus {
//   isOnline: boolean;
//   lastSeen?: Date;
// }

const ChatSession: React.FC = () => {
  const router = useRouter();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const { chatRooms, fetchAllChatRooms } = useChatRooms();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { socket } = useSocketStore();
  const { fetchNotifications } = useChatNotifications();

  useEffect(() => {
    fetchNotifications().catch((err) => console.error('Error fetching notifications:', err));
  }, [fetchNotifications]);

   useEffect(() => {
     const cleanup = chatSocketService.setupMessageListener(
       socket,
       selectedChatRoom,
       (newMessage) => {
         setMessages((prevMessages) => [...prevMessages, newMessage]);
       }
     );
 
     return cleanup;
   }, [selectedChatRoom, socket]);
 
  useEffect(() => {
    fetchAllChatRooms();
  }, [fetchAllChatRooms]);

  useEffect(() => {
    console.log('Fetching data...');
    fetchPerformerDetails();
  }, [fetchPerformerDetails]);
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChatRoom && performerDetails?.PId) {
        try {
          // Update online status
          await chatService.updateUserOnlineStatus(selectedChatRoom.myId, selectedChatRoom.otherId);
          
          // Fetch messages
          const messages = await chatService.getChatMessages(selectedChatRoom.myId, selectedChatRoom.otherId);
          setMessages(messages);
          
          // Fetch notifications
          const notifications = await chatService.getMessageNotifications(selectedChatRoom.myId);
          console.log("res", notifications);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };
    fetchMessages();
  }, [selectedChatRoom, performerDetails]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChatRoom && performerDetails?.PId && socket) {
      try {
        // Send message through API
    await chatService.sendMessage(
          performerDetails.PId,
          selectedChatRoom.otherId,
          newMessage
        );
  
        // Emit socket event


         // Emit socket event
                chatSocketService.emitMessage(
                  socket,
                  selectedChatRoom.myId,
                  selectedChatRoom.otherId,
                  newMessage
                );
     
  
        // Optimistically add new message
          const newMessageObj: Message = {
                _id: `temp-${Date.now()}`,
                roomId: "",
                senderId: new mongoose.Types.ObjectId(selectedChatRoom.myId),
                receiverId: new mongoose.Types.ObjectId(selectedChatRoom.otherId),
                message: newMessage,
                timestamp: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                __v: 0,
              };
      
              setMessages((prevMessages) => [...prevMessages, newMessageObj]);
              setNewMessage("");
            } catch (error) {
              console.error("Error sending message:", error);
            }
          }
        };

  const handleLogout = () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setTimeout(() => {
      router.replace('/');
    }, 1000);
  };

  const filteredChatRooms = chatRooms.filter(room => {
    const searchTermLower = searchTerm.toLowerCase();
    const userName = room.userName?.toLowerCase() || '';
    const performerName = room.performerName?.toLowerCase() || '';
    
    return userName.includes(searchTermLower) || 
           performerName.includes(searchTermLower);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex">
      <Sidebar 
        isOpen={sidebarOpen}
        performerDetails={performerDetails}
        onLogout={handleLogout}
      />

      <div className="flex-1 md:ml-64">
        <nav className="bg-white shadow-lg fixed top-0 right-0 left-0 md:left-64 flex justify-between items-center px-6 py-4 z-20">
          <div className="flex items-center">
            <button
              className="md:hidden text-indigo-600 mr-4"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            BookItNow
          </h1>
          <div className="flex items-center">
            <a href="/chatsession" className="relative text-gray-700 hover:text-blue-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2z" />
              </svg>
            </a>
          </div>
        </nav>

        <main className="pt-20 p-6">
          <div className="flex flex-col items-center justify-center py-0 px-4 md:px-8">
            <div className="flex flex-col w-full bg-white shadow-2xl rounded-2xl overflow-hidden border-2 border-indigo-100">
              <div className="flex">
                <div className="w-1/4 border-r border-indigo-100 p-4 bg-gray-50">
                  <div className="relative mb-4 group">
                    <input 
                      type="text"
                      placeholder="Search chats..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-full border border-indigo-200 focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out shadow-sm group-hover:shadow-md"
                    />
                    <Search 
                      size={20} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 transition duration-300 group-hover:text-indigo-600" 
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-4 text-indigo-700">Chats</h3>
                  <ul className="space-y-2">
                    {filteredChatRooms.map((room) => (
                      <li
                        key={room.otherId}
                        onClick={() => setSelectedChatRoom(room)}
                        className={`p-3 cursor-pointer rounded-lg transition duration-300 transform hover:scale-105 flex items-center ${
                          selectedChatRoom?.otherId === room.otherId 
                            ? 'bg-indigo-100 text-indigo-800 scale-105' 
                            : 'hover:bg-indigo-50'
                        }`}
                      >
                        <div className="relative">
                          <Image 
                            src={room.profileImage} 
                            alt={room.userName} 
                            width={32}
                            height={32}
                             className="w-8 h-8 rounded-full mr-3"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-indigo-800">{room.userName}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-3/4 p-4 flex flex-col">
                  <div className="h-[500px] overflow-y-auto border-2 border-indigo-100 rounded-xl p-4 bg-gradient-to-br from-white to-indigo-50 mb-4 shadow-inner">
                    {selectedChatRoom ? (
                      <div className="space-y-3">
                        <div className="mb-4 flex items-center border-b pb-2 border-indigo-100">
                          <div className="relative">
                            <Image 
                              src={selectedChatRoom.profileImage} 
                              alt={selectedChatRoom.userName} 
                              width={48}
                              height={48}
                              className="rounded-full mr-3 border-2 border-white shadow-md"
                            />
                            {/* <span className={`absolute bottom-0 right-3 w-3 h-3 ${
                              onlineStatus.isOnline ? 'bg-green-500' : 'bg-gray-400'
                            } rounded-full border-2 border-white`}></span> */}
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-indigo-800">
                              {selectedChatRoom.userName}
                            </p>
                            {/* <p className="text-sm text-indigo-600">
                              {onlineStatus.isOnline ? 'Online' : 'Offline'}
                              {!onlineStatus.isOnline && onlineStatus.lastSeen && 
                                ` - Last seen ${new Date(onlineStatus.lastSeen).toLocaleString()}`
                              }
                            </p> */}
                          </div>
                        </div>
                        {messages.map((message) => (
                          <div 
                            key={message._id} 
                            className={`flex ${
                              message.senderId.toString() === selectedChatRoom.myId 
                                ? 'justify-end' 
                                : 'justify-start'
                            }`}
                          >
                            <div 
                              className={`p-3 rounded-2xl max-w-[70%] mb-2 relative ${
                                message.senderId.toString() === selectedChatRoom.myId 
                                  ? 'bg-indigo-500 text-white' 
                                  : 'bg-gray-200 text-gray-800'
                              }`}
                            >
                              {message.message}
                              <div className={`text-xs text-right mt-1 opacity-70 ${
                                message.senderId.toString() === selectedChatRoom.myId 
                                  ? 'text-indigo-200' 
                                  : 'text-gray-500'
                              }`}>
                                {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messageEndRef} />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <MessageCircle size={64} className="text-indigo-400 mb-4" />
                        <p className="text-xl font-semibold text-indigo-700 mb-2">
                          Welcome to <span className="text-purple-600">BookItNow</span> Chat
                        </p>
                        <p className="text-indigo-500 max-w-md">
                          Select a chat to start messaging. Connect, communicate, and make your bookings smooth and easy.
                        </p>
                      </div>
                    )}
                  </div>
                  {selectedChatRoom && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border-2 border-indigo-200 rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-full hover:from-indigo-700 hover:to-purple-700 transition duration-300 transform hover:scale-110"
                      >
                      <Send size={24} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-10"
              onClick={toggleSidebar}
            ></div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatSession;