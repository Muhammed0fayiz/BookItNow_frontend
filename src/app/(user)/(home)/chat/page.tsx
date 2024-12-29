'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '@/shared/axiousintance';
import useUserStore from '@/store/useUserStore';
import useChatRooms from '@/store/chatstore';
import mongoose from 'mongoose';
import { Send } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

// Updated Message interface to match backend structure
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

const Chat = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const { fetchUserProfile, userProfile } = useUserStore();
  const { chatRooms, fetchAllChatRooms } = useChatRooms();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log('sokent')
    socketRef.current = io('http://localhost:5000', {
      withCredentials: true
    });
    console.log('sokent')
    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

    useEffect(() => {
      if (selectedChatRoom && socketRef.current) {
    
        socketRef.current.emit('userConnected', selectedChatRoom.myId);
  
        // Listen for new messages
        socketRef.current.on('receiveMessage', ({ senderId, message }) => {
          setMessages(prevMessages => [...prevMessages, {
            _id: new mongoose.Types.ObjectId().toString(),
            roomId: selectedChatRoom.otherId,
            senderId: new mongoose.Types.ObjectId(senderId),
            receiverId: new mongoose.Types.ObjectId(selectedChatRoom.myId),
            message: message,
            timestamp: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0,
            role: 'receiver'
          }]);
        });
      }
  
      return () => {
        if (socketRef.current) {
          socketRef.current.off('receiveMessage');
        }
      };
    }, [selectedChatRoom]);

  useEffect(() => {
    fetchAllChatRooms();
  }, [fetchAllChatRooms]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadUserProfile = async () => {
      await fetchUserProfile();
    };
    loadUserProfile();
  }, [fetchUserProfile]);

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

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const profilePage = () => router.replace('/profile');

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChatRoom) {
      try {
        if (!userProfile?.id) {
          console.error('User profile not found');
          return;
        }
        await axiosInstance.post(
          `/handleSendMessage/${userProfile.id}/${selectedChatRoom.otherId}`,
          { message: newMessage }
        );
        const messageData = { senderId :userProfile.id, receiverId:selectedChatRoom.otherId, newMessage };

        if(socketRef.current)

          socketRef.current.emit('sendMessage', {
            senderId: selectedChatRoom.myId,
            receiverId: selectedChatRoom.otherId,
            message: newMessage
          });
        
        
        // Optimistically add the new message to the messages array
        const newMessageObj: Message = {
          _id: `temp-${Date.now()}`,
          roomId: '', // You might want to set this appropriately
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
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar remains the same as in previous code */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Left Side: Logo */}
          <div className="flex items-center space-x-6">
            <a href="/home" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300">
              BookItNow
            </a>
          </div>

          {/* Menu Button for Small Devices */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Menu
            </button>
          </div>

          {/* Full Navbar for Large Devices */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-blue-600 font-semibold transition duration-300">
              Home
            </a>
            <a href="/events" className="text-gray-700 hover:text-blue-600 transition duration-300">
              Events
             
            </a>
           

            <a href="/about" className="text-gray-700 hover:text-blue-600 transition duration-300">
              About
            </a>
            <a href="/chat" className="relative text-gray-700 hover:text-blue-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2z" />
              </svg>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                3
              </span>
            </a>
            <a href="/profile" className="text-gray-700 hover:text-blue-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7 7 0 1112 19a7 7 0 01-6.879-5.196m6.879-9.196a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Sidebar for Small Devices */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
            <div className="fixed right-0 top-0 w-64 h-full bg-white shadow-lg z-50">
              <button
                className="absolute top-4 right-4 text-gray-600"
                onClick={toggleMenu}
              >
                &times;
              </button>
              <div className="flex flex-col p-6">
                <a href="/" className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4">
                  Home
                </a>
                <a href="/events" className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4">
                  Events
                </a>
                <a href="/about" className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4">
                  About
                </a>
                <a href="/chat" className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4">
                  Chat
                </a>
                <a  className="text-gray-700 hover:text-blue-600 transition duration-300"onClick={profilePage}>
                  Profile
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center py-0 px-4 md:px-8">
        <div className="flex flex-col w-full md:w-3/4 bg-white shadow-lg rounded-lg">
          <div className="flex">
            {/* Chat Rooms List */}
            <div className="w-1/4  border-r p-4 bg-gray-100">
              <h3 className="text-lg font-semibold mb-4">Chat Rooms</h3>
              <ul>
                {chatRooms.map((chatRoom) => (
                  <li
                    key={chatRoom.otherId}
                    onClick={() => setSelectedChatRoom(chatRoom)}
                    className={`p-2 cursor-pointer rounded-md transition-colors duration-200 flex items-center ${
                      selectedChatRoom?.otherId === chatRoom.otherId
                        ? 'bg-blue-100 font-semibold'
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    <img 
                      src={chatRoom.profileImage} 
                      alt={chatRoom.userName} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div>{chatRoom.userName}</div>
                      <div className="text-xs text-gray-500">{chatRoom.performerName}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Chat Section */}
            <div className="w-3/4 p-4 flex flex-col">
              {/* Chat Header */}
              {selectedChatRoom && (
                <div className="bg-blue-50 p-3 rounded-t-lg border-b mb-4 flex items-center">
                  <img 
                    src={selectedChatRoom.profileImage} 
                    alt={selectedChatRoom.userName} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-blue-800">
                      {selectedChatRoom.userName}
                      
                    </h2>
                    <p className="text-sm text-gray-600">{selectedChatRoom.performerName}</p>
                  </div>
                </div>
              )}
              
              {/* Messages Container */}
          {/* Messages Container */}
<div className="flex-grow h-80 overflow-y-auto border rounded-md p-4 bg-gray-50 space-y-3">
  {!selectedChatRoom ? (
    <p className="text-gray-700 text-center font-medium">
      <span className="text-blue-500 font-bold">BookItNow</span> provides an interactive{" "}
      <span className="text-green-500">chatting feature</span>. You can easily chat with the{" "}
      <span className="text-purple-500">Performer</span> to discuss details and more.
    </p>
  ) : (
    messages.map((message) => (
      <div 
        key={message._id} 
        className={`flex ${
          message.senderId.toString() === userProfile?.id 
            ? 'justify-end' 
            : 'justify-start'
        }`}
      >
        <div 
          className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
            message.senderId.toString() === userProfile?.id 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-black'
          }`}
        >
          {message.message}
          <div className="text-xs mt-1 opacity-70 text-right">
            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
      </div>
    ))
  )}
  <div ref={messagesEndRef} />
</div>

              
              {/* Message Input */}
              {selectedChatRoom && (
                <div className="mt-4 flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-grow border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
                  >
                    <Send size={24} />
                  </button>
                
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;