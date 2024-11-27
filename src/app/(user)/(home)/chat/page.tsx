'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import useUserStore from '@/store/useUserStore';

const Home = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState(''); // State to track the new message

  const { userProfile, isLoading, error, fetchUserProfile } = useUserStore();

  useEffect(() => {
    const loadUserProfile = async () => {
      await fetchUserProfile();
    };
    loadUserProfile();
  }, [fetchUserProfile]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
  ];

  const messages = [
    { id: 1, sender: "John Doe", content: "Hello!", timestamp: "10:00 AM" },
    { id: 2, sender: "You", content: "Hi there!", timestamp: "10:05 AM" },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMsg = {
        id: messages.length + 1,
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      messages.push(newMsg); // Add the new message to the messages array
      setNewMessage(''); // Clear the input field
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/home" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300">
            BookItNow
          </a>
          <div className="flex md:hidden">
            <button onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 transition duration-300">
              Menu
            </button>
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center py-12 px-4 md:px-8">
        {/* Chat Modal */}
        <div className="flex flex-col w-full md:w-3/4 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex">
            {/* Left Section: Users List */}
            <div className="w-1/4 border-r p-4 bg-gray-100">
              <h3 className="text-lg font-semibold mb-4">Users</h3>
              {/* <ul>
                {users.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-2 cursor-pointer rounded-md ${
                      selectedUser?.id === user.id ? "bg-blue-100" : ""
                    }`}
                  >
                    {user.name}
                  </li>
                ))}
              </ul> */}
            </div>

            {/* Right Section: Chat */}
            <div className="w-3/4 p-4">
              <div className="h-96 overflow-y-auto border rounded-md p-4 bg-gray-50">
                {selectedUser ? (
                  messages.map((msg) => (
                    <div key={msg.id} className={`mb-4 ${msg.sender === "You" ? "text-right" : ""}`}>
                      <p className="text-sm text-gray-600">{msg.sender}</p>
                      <p className="text-md bg-gray-200 p-2 rounded-md inline-block">{msg.content}</p>
                      <p className="text-xs text-gray-400">{msg.timestamp}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">Select a user to start chatting</p>
                )}
              </div>
              {selectedUser && (
                <div className="mt-4">
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

export default Home;
