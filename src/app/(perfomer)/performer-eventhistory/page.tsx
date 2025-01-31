'use client'
import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, MessageCircle, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '@/component/performersidebar';
import { useUIStore } from '@/store/useUIStore';
import { useChatStore } from '@/store/useChatStore';
import usePerformerStore from '@/store/usePerformerStore';
import useChatNotifications from '@/store/useChatNotification';
import { useEventHistory } from '@/store/usePerformerEventHistory';

// Types
interface DashboardSectionProps {
  title: string;
  children: ReactNode;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Utility Functions
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

// Components
const DashboardSection: React.FC<DashboardSectionProps> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-4 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center space-x-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-white border hover:bg-gray-50'
            }`}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

const EventCard: React.FC<any> = ({ event }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
        <p><strong>Date:</strong> {formatDate(event.date)}</p>
        <p><strong>Time:</strong> {formatTime(event.time)}</p>
        <p><strong>Place:</strong> {event.place}</p>
        <p><strong>Category:</strong> {event.category}</p>
        <p>
          <strong>Status:</strong> 
          <span className={event.bookingStatus === "booking" ? "text-green-600" : "text-red-600"}>
            {event.bookingStatus === "booking" ? "Completed" : "Cancelled"}
          </span>
        </p>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-green-600 font-medium">₹{event.price}</span>
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
);

const UpcomingEvents: React.FC = () => {
  const { performerupcomingEvents } = useEventHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(performerupcomingEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = performerupcomingEvents.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardSection title="Event History">
      {performerupcomingEvents.length === 0 ? (
        <p className="text-gray-500 text-center">No events history</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
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
  const { totalUnreadMessage, notifications, fetchNotifications } = useChatNotifications();

  useEffect(() => {
    fetchNotifications().catch((err) => console.error('Error fetching notifications:', err));
  }, [fetchNotifications]);

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
      {/* Sidebar */}
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
            <button 
              className="md:hidden text-blue-600 mr-4" 
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-blue-600">BookItNow</h1>
          <div className="flex items-center">
          <a href="/chatsession" className="relative text-gray-700 hover:text-blue-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2z" />
              </svg>
              {totalUnreadMessage > 0 && (
  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
    {totalUnreadMessage}
  </span>
)}
            </a>
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
            <button onClick={toggleChat} className="text-white" aria-label="Toggle chat">
              <Menu size={20} />
            </button>
          </div>
          <div className="h-80 overflow-y-auto p-4">
            {messages.map((msg: any) => (
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
                aria-label="Chat message"
              />
              <button 
                onClick={sendMessage} 
                className="bg-blue-600 text-white p-2 rounded-r-lg"
                aria-label="Send message"
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
          className="fixed inset-0 bg-black opacity-50 z-10" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default PerformerDashboard;