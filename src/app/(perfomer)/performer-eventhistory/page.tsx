'use client'
import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, MessageCircle, Send } from 'lucide-react';
import Sidebar from '@/component/performersidebar';
import { useUIStore } from '@/store/useUIStore';
import { useChatStore } from '@/store/useChatStore';
import usePerformerStore from '@/store/usePerformerStore';

import axiosInstance from '@/shared/axiousintance';
import { useEventHistory } from '@/store/usePerformerEventHistory';

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

const formatTime = (timeString: string) => {
  try {
    if (!timeString) return 'Time not available';
    
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    return timeString;
  } catch (error) {
    console.log('Time parsing error:', error);
    return timeString;
  }
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.log('Date parsing error:', error);
    return 'Date not available';
  }
};

const UpcomingEvents: React.FC = () => {
  const { performerupcomingEvents } = useEventHistory();

  return (
    <DashboardSection title="Upcoming Events">
    {performerupcomingEvents.length === 0 ? (
      <p className="text-gray-500 text-center">No upcoming events</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {performerupcomingEvents.map((event) => (
          <div 
            key={event._id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {event.imageUrl && (
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Date:</strong>  {formatDate(event.date)}</p>
                <p><strong>Time:</strong>  {formatTime(event.time)}</p>
                <p><strong>Place:</strong> {event.place}</p>
                <p><strong>Category:</strong> {event.category}</p>
                <p>
  <strong>Status:</strong> 
  <span 
    style={{
      color: event.bookingStatus === "booking" ? "green" : "red"
    }}
  >
    {event.bookingStatus === "booking" ? "Completed" : "Cancelled" }
  </span>
</p>


              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-green-600 font-medium">
                ₹{event.price}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  event.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                  event.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {event.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </DashboardSection>
  );
};

const PerformerDashboard: React.FC = () => {
  const router = useRouter();
  const { performerupcomingEvents, fetchAllEvents } = useEventHistory();
  
  // UI Store
  const { sidebarOpen, chatOpen, toggleSidebar, toggleChat } = useUIStore();
  
  // Performer Store
  const { performerDetails, fetchPerformerDetails } = usePerformerStore();
  
  // Chat Store
  const { messages, newMessage, setNewMessage, sendMessage } = useChatStore();

  useEffect(() => {
    fetchPerformerDetails();
    fetchAllEvents();
  }, [fetchPerformerDetails, fetchAllEvents]);

  const handleLogout = () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    setTimeout(() => {
      router.replace('/auth');
    }, 1000);
  };

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

        {/* Main Content Area */}
        <main className="pt-20 p-6">
          <UpcomingEvents />
        </main>

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