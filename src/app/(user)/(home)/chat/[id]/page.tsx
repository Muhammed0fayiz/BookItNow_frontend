'use client'
import { useState, useEffect } from 'react';
import useUserStore from '@/store/useUserStore';
import usePerformersStore from '@/store/useAllPerformerStore';
import { Performer } from '@/types/store';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/shared/axiousintance';

const Home = () => {
  const router = useRouter();
  const params = useParams();
  const performerid = params.id as string;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null);

  const { fetchUserProfile } = useUserStore();
  const { performers, fetchAllPerformers } = usePerformersStore();

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
        // Ensure you have access to the user profile, likely from the user store
        const userProfile = useUserStore.getState().userProfile; 
        
        if (!userProfile || !userProfile.id) {
          console.error('User profile not found');
          return;
        }
  
        const response = await axiosInstance.post(`/handleSendMessage/${userProfile.id}/${performerid}`, {
          message: newMessage,
          performerId: selectedPerformer.userId
        });
  
        // Optional: handle successful message send
        console.log('Message sent successfully', response.data);
        
        // Clear the input field after sending
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        // Optional: add user-friendly error handling, like a toast notification
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a
            href="/home"
            className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300"
          >
            BookItNow
          </a>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center py-12 px-4 md:px-8">
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
