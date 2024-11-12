'use client'
import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, MessageCircle, Send } from 'lucide-react';
import Sidebar from '@/component/performersidebar';
import { useUIStore } from '@/store/useUIStore';
import { useChatStore } from '@/store/useChatStore';
import usePerformerStore from '@/store/usePerformerStore';

// import { usePerformerStore } from '@/store/usePerformerStore';

interface DashboardSectionProps {
  title: string;
  children: ReactNode;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const PerformerDashboard: React.FC = () => {
  const router = useRouter();
  
  // UI Store
  const { sidebarOpen, chatOpen, toggleSidebar, toggleChat } = useUIStore();
  
  // Performer Store
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();
  
  // Chat Store
  const { messages, newMessage, setNewMessage, sendMessage } = useChatStore();

  useEffect(() => {
    fetchPerformerDetails();
  }, [fetchPerformerDetails]);

  const handleLogout = () => {
    console.log('enter logout');
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setTimeout(() => {
      router.replace('/auth');
    }, 1000);
  };
  useEffect(() => {
    console.log('hello', performerDetails);
  }, []); // Add performerDetails to dependency array


  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpen}
        performerDetails={performerDetails}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Top Navbar */}
        <nav className="bg-white shadow-md fixed top-0 right-0 left-0 md:left-64 flex justify-between items-center px-6 py-4 z-10">
          <div className="flex items-center">
            <button className="md:hidden text-blue-600 mr-4" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-blue-600">BookItNow</h1>
          <div className="flex items-center">
            <button onClick={toggleChat} className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition duration-300">
              <MessageCircle size={24} />
            </button>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className={`p-6 mt-20 ${sidebarOpen ? 'blur-sm' : ''}`}>
          <DashboardSection title="Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Band Name</h3>
                <p>{performerDetails?.bandName || 'Loading...'}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Location</h3>
                <p>{performerDetails?.place || 'Loading...'}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Rating</h3>
                <p>{performerDetails?.rating || 'N/A'} / 5</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Description</h3>
              <p>{performerDetails?.description || 'No description available.'}</p>
            </div>
          </DashboardSection>

          {/* Rest of the DashboardSections remain the same */}

        </div>

        {/* Chat Section */}
        <div className={`fixed right-0 bottom-0 w-80 bg-white shadow-lg transition-transform duration-300 ${chatOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">Chat</h3>
            <button onClick={toggleChat} className="text-white">
              <Menu size={20} />
            </button>
          </div>
          <div className="h-80 overflow-y-auto p-4">
            {messages.map((msg: { id: React.Key | null | undefined; sender: string; text: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
              <div key={msg.id} className={`mb-2 ${msg.sender === 'performer' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.sender === 'performer' ? 'bg-blue-100' : 'bg-gray-200'}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow border rounded-l-lg p-2"
                placeholder="Type a message..."
              />
              <button onClick={sendMessage} className="bg-blue-600 text-white p-2 rounded-r-lg">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default PerformerDashboard;



