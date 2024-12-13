'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Send, MessageCircle, Home, Calendar, User, X } from 'lucide-react';
import axiosInstance from '@/shared/axiousintance';
import useUserStore from '@/store/useUserStore';
import useChatRooms from '@/store/chatstore';
import mongoose from 'mongoose';
import { socket } from '@/shared/socket';

// Existing interfaces
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

export interface ChatRoom {
  profileImage: string;
  userName: string;
  performerName: string; 
  myId: string;
  otherId: string;
}

const ChatPage: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { fetchUserProfile, userProfile } = useUserStore();
  const { chatRooms, fetchAllChatRooms } = useChatRooms();

  // Fetch data on component mount
  useEffect(() => {
    fetchAllChatRooms();
    fetchUserProfile();
  }, []);

  // Socket connection for real-time messaging
  useEffect(() => {
    if (userProfile?.id) {
      // Listen for new messages
      socket.on('newMessage', (message: Message) => {
        if (
          message.senderId.toString() === selectedChatRoom?.otherId || 
          message.receiverId.toString() === selectedChatRoom?.otherId
        ) {
          setMessages(prevMessages => [...prevMessages, message]);
        }
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [userProfile, selectedChatRoom]);

  // Fetch messages when a chat room is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChatRoom && userProfile?.id) {
        try {
          const response = await axiosInstance.get(
            `/chat-with/${userProfile.id}/${selectedChatRoom.otherId}`
          );
          setMessages(response.data.data || []);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };
    fetchMessages();
  }, [selectedChatRoom, userProfile]);

  // Message sending handler
  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChatRoom && userProfile?.id) {
      try {
        const messageData = {
          senderId: userProfile.id,
          receiverId: selectedChatRoom.otherId,
          message: newMessage
        };

        // Emit socket event for real-time messaging
        socket.emit('sendMessage', messageData);

        // Optimistically add message
        const newMessageObj: Message = {
          _id: `temp-${Date.now()}`,
          roomId: '', 
          senderId: new mongoose.Types.ObjectId(userProfile.id),
          receiverId: new mongoose.Types.ObjectId(selectedChatRoom.otherId),
          message: newMessage,
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0
        };
        
        setMessages(prevMessages => [...prevMessages, newMessageObj]);
        setNewMessage('');

        // Send message via API
        await axiosInstance.post(
          `/handleSendMessage/${userProfile.id}/${selectedChatRoom.otherId}`,
          { message: newMessage }
        );
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // Navigation and UI handlers
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const navigateTo = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a 
              href="/home" 
              className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300"
            >
              BookItNow
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X /> : <MessageCircle />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {[
              { icon: <Home />, href: "/", label: "Home" },
              { icon: <Calendar />, href: "/events", label: "Events" },
              { icon: <MessageCircle />, href: "/chat", label: "Chat", badge: 3 },
              { icon: <User />, href: "/profile", label: "Profile" }
            ].map((item) => (
              <a 
                key={item.href}
                href={item.href} 
                className="relative text-gray-700 hover:text-blue-600 transition duration-300 flex items-center"
              >
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Sidebar */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={toggleMenu}>
            <div 
              className="fixed right-0 top-0 w-64 h-full bg-white shadow-lg z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-4">
                {[
                  { href: "/", label: "Home" },
                  { href: "/events", label: "Events" },
                  { href: "/chat", label: "Chat" },
                  { href: "/profile", label: "Profile" }
                ].map((item) => (
                  <a 
                    key={item.href}
                    href={item.href} 
                    className="block text-gray-700 hover:text-blue-600 transition duration-300"
                    onClick={() => navigateTo(item.href)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Chat Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Chat Rooms Sidebar */}
          <div className="col-span-4 bg-gray-100 border-r">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Chat Rooms</h3>
              <div className="space-y-2">
                {chatRooms.map((chatRoom) => (
                  <div
                    key={chatRoom.otherId}
                    onClick={() => setSelectedChatRoom(chatRoom)}
                    className={`
                      flex items-center p-3 rounded-lg cursor-pointer 
                      transition-all duration-200
                      ${selectedChatRoom?.otherId === chatRoom.otherId 
                        ? 'bg-blue-100 shadow-md' 
                        : 'hover:bg-gray-200'}
                    `}
                  >
                    <img 
                      src={chatRoom.profileImage} 
                      alt={chatRoom.userName} 
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {chatRoom.userName}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {chatRoom.performerName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="col-span-8 flex flex-col">
            {!selectedChatRoom ? (
              <div className="flex-grow flex items-center justify-center text-gray-400">
                <MessageCircle className="w-16 h-16 mr-4" />
                <p className="text-xl">Select a chat room to start messaging</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="bg-blue-50 p-4 flex items-center border-b">
                  <img 
                    src={selectedChatRoom.profileImage} 
                    alt={selectedChatRoom.userName} 
                    className="w-14 h-14 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-blue-800">
                      {selectedChatRoom.userName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedChatRoom.performerName}
                    </p>
                  </div>
                </div>

                {/* Messages Container */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages.map((message) => (
                    <div 
                      key={message._id} 
                      className={`flex ${
                        message.senderId.toString() === userProfile?.id 
                          ? 'justify-end' 
                          : 'justify-start'
                      }`}
                    >
                      <div 
                        className={`
                          max-w-[70%] p-3 rounded-lg shadow-sm 
                          ${message.senderId.toString() === userProfile?.id 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white text-gray-800 border'}
                        `}
                      >
                        {message.message}
                        <div className="text-xs mt-1 opacity-70 text-right">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit', 
                            minute:'2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="bg-white p-4 border-t flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="
                      flex-grow 
                      p-3 
                      bg-gray-100 
                      rounded-full 
                      focus:outline-none 
                      focus:ring-2 
                      focus:ring-blue-300
                    "
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="
                      bg-blue-500 
                      text-white 
                      p-3 
                      rounded-full 
                      hover:bg-blue-600 
                      transition-colors 
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;