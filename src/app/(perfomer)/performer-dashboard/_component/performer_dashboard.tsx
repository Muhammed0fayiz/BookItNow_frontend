'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, MessageCircle, Send } from 'lucide-react';
import Sidebar from '@/component/performersidebar';
import { useUIStore } from '@/store/useUIStore';
import { useChatStore } from '@/store/useChatStore';
import usePerformerStore from '@/store/usePerformerStore';
import useWalletHistoryStore from '@/store/useWalletHistory';
import axiosInstance from '@/shared/axiousintance';
import usePerformerAllDetails from '@/store/usePerformerAllDetails';

import { 
  PerformanceOverviewCard, 
  EventHistoryChart, 
  WalletTransactionChart, 
  UpcomingEventsPieChart 
} from '@/component/DashboardCharts';

const PerformerDashboard: React.FC = () => {
  const router = useRouter();
  
  // Store hooks
  const { sidebarOpen, chatOpen, toggleSidebar, toggleChat } = useUIStore();
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();
  const { performerAllDetails, fetchPerformerAllDetails } = usePerformerAllDetails();
  const { messages, newMessage, setNewMessage, sendMessage } = useChatStore();
  const { walletHistory, fetchWalletHistory } = useWalletHistoryStore();

  // Fetch data on component mount
  useEffect(() => {
    const userId = usePerformerAllDetails.getState().getUserIdFromToken();
    if (userId) {
      fetchPerformerAllDetails(userId);
      fetchPerformerDetails();
      fetchWalletHistory();
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setTimeout(() => {
      router.replace('/auth');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        performerDetails={performerDetails}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 relative">
        {/* Top Navbar */}
        <nav className="bg-white shadow-md fixed top-0 right-0 left-0 md:left-64 flex justify-between items-center px-6 py-4 z-20">
          <div className="flex items-center">
            <button className="md:hidden text-blue-600 mr-4" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-blue-600">BookItNow</h1>
          </div>
          <div className="flex items-center">
            <button 
              onClick={toggleChat} 
              className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition duration-300"
            >
              <MessageCircle size={24} />
            </button>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className={`p-6 mt-20 ${sidebarOpen ? 'blur-sm' : ''}`}>
          {/* Performance Overview */}
          <section className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Performance Overview</h2>
            <PerformanceOverviewCard />
          </section>

          {/* Charts Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2 lg:col-span-2">
              <EventHistoryChart />
            </div>
            <div className="md:col-span-1 lg:col-span-1">
              <UpcomingEventsPieChart />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <WalletTransactionChart />
            </div>
          </section>

          {/* Band Details */}
          <section className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Band Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
           
                <p>{(performerDetails?.rating ? performerDetails.rating.toFixed(1) : 'N/A')} / 5</p>

              </div>
            </div>
          </section>
        </div>

        {/* Chat Section */}
        <div 
          className={`fixed right-0 bottom-0 w-80 bg-white shadow-lg transition-transform duration-300 
            ${chatOpen ? 'translate-y-0' : 'translate-y-full'} z-30`}
        >
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">Chat</h3>
            <button onClick={toggleChat} className="text-white">
              <Menu size={20} />
            </button>
          </div>
          <div className="h-80 overflow-y-auto p-4">
            {messages.map((msg: any) => (
              <div 
                key={msg.id} 
                className={`mb-2 ${msg.sender === 'performer' ? 'text-right' : 'text-left'}`}
              >
                <span 
                  className={`inline-block p-2 rounded-lg 
                    ${msg.sender === 'performer' ? 'bg-blue-100' : 'bg-gray-200'}`}
                >
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
              <button 
                onClick={sendMessage} 
                className="bg-blue-600 text-white p-2 rounded-r-lg"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default PerformerDashboard;