'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { banner1, djparty, motivationspeaker, music } from '@/datas/homepagedatas';
import UploadEventForm from '@/component/perfomerform';

import usePerformersStore from '@/store/useAllPerformerStore';
import { Performer } from '@/types/store';

import axiosInstance from '@/shared/axiousintance';
// import axios from 'axios';
// import axiosInstance from '@/shared/axiousintance';

// import useAuth from '@/hooks/fetchUser';
import useUserStore from '@/store/useUserStore';


const Chat = () => {
  const router = useRouter()

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null);

 
  // const { userDetails, loading, error } = useAuth();


  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  const { fetchUserProfile } = useUserStore();
  const { performers, fetchAllPerformers } = usePerformersStore();


 
  
  const { 
    userProfile, 
    isLoading, 
    error, 
  
   
  } = useUserStore();
  useEffect(() => {
    const loadUserProfile = async () => {
      await fetchUserProfile();
    };
    loadUserProfile();
  }, [fetchUserProfile]);
  useEffect(() => {
    const loadUserProfile = async () => {
      await fetchUserProfile();
    };
    loadUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    fetchAllPerformers();
    
  }, [fetchAllPerformers]);
  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && selectedPerformer) {
      try {
        // Get the current user's profile
        const userProfile = useUserStore.getState().userProfile; 
        
        if (!userProfile || !userProfile.id) {
          console.error('User profile not found');
          return;
        }
  
        // Send message with BOTH sender and receiver IDs
        const response = await axiosInstance.post(`/handleSendMessage/${userProfile.id}/${selectedPerformer.userId}`, {
          message: newMessage
        });
  
        // Clear message input after sending
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  const handlefetch=async()=>{
    const loadUserProfile = async () => {
      await fetchUserProfile();
    };
    loadUserProfile();
  }

  // {userDetails?.id}
  const profilePage: () => void = () => {
    router.replace('/profile');
  };
 
  return (
    <div className="min-h-screen bg-gray-50">
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
            <a href="/home" className="text-gray-700 hover:text-blue-600 transition duration-300">
              Home
            </a>
            <a href="/events" className="text-gray-700 hover:text-blue-600 transition duration-300">
              Events
             
            </a>
           

            <a href="/about" className="text-gray-700 hover:text-blue-600 transition duration-300">
              About
            </a>
            <a href="/chat" className="text-blue-600 font-semibold transition duration-300">
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


 
      
      <main className="flex flex-col items-center justify-center py-0 px-4 md:px-8">
        {/* Chat Modal */}
        <div className="flex flex-col w-full md:w-3/4 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex">
            {/* Left Section: Performers List */}
            <div className="w-1/4 border-r p-4 bg-gray-100">
              <h3 className="text-lg font-semibold mb-4">Performers</h3>
              <ul>
                {performers.map((performer) => (
                  <li
                    key={performer.userId}
                    onClick={() => setSelectedPerformer(performer)} // Set selected performer for chat
                    className={`p-2 cursor-pointer rounded-md ${
                      selectedPerformer?.userId === performer.userId
                        ? 'bg-blue-100'
                        : ''
                    }`}
                  >
                    {performer.bandName} {/* Assuming performer has a 'bandName' property */}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Section: Chat */}
            <div className="w-3/4 p-4">
              <div className="h-96 overflow-y-auto border rounded-md p-4 bg-gray-50">
                {selectedPerformer ? (
                  <div>
                    <div className="mb-4">
                      <p className="text-md bg-gray-200 p-2 rounded-md inline-block">
                        {`Chat with ${selectedPerformer.bandName}`}
                      </p>
                    </div>
                    {/* Add message rendering logic here */}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">
                    Select a performer to start chatting
                   
                  
                  
                  </p>
                )}
              </div>
              {selectedPerformer && (
                <div className="mt-4">
                   {userProfile?.id}
                   <h1>hee</h1>
                   {selectedPerformer?.userId}
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)} // Bind input to state
                    placeholder="Type your message..."
                    className="w-full border rounded-md p-2"
                  />
                  <button
                    onClick={handleSendMessage} // Send message on button click
                    className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      
      <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-8">
        <p>&copy; 2024 BookItNow. All rights reserved.</p>
      </footer>
    </div>
  );
};


export default Chat;
